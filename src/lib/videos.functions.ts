import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isConfiguredAdmin, type VideoRow } from "./account.functions";
import { unpackLessonDescription } from "./video-lesson-meta";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const VIDEO_COLUMNS = "id, title, description, thumbnail, access_type, created_at";

function normalizeVideoRows(rows: Array<Record<string, unknown>>): VideoRow[] {
  return rows.map((row) => {
    const unpacked = unpackLessonDescription(row.description);
    return {
      id: String(row.id),
      title: String(row.title ?? ""),
      description: unpacked.description,
      thumbnail: typeof row.thumbnail === "string" ? row.thumbnail : null,
      access_type: row.access_type === "free" ? "free" : "premium",
      created_at: String(row.created_at ?? ""),
      badge: unpacked.meta.badge,
      dialogues: unpacked.meta.dialogues,
      vocab: unpacked.meta.vocab,
    };
  });
}

async function signThumbnails(rows: VideoRow[]): Promise<VideoRow[]> {
  const paths = rows
    .map((r) => r.thumbnail)
    .filter((t): t is string => !!t && !t.startsWith("http"));
  if (paths.length === 0) return rows;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage
    .from("thumbnails")
    .createSignedUrls(paths, 60 * 60);
  const byPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return rows.map((r) =>
    r.thumbnail && !r.thumbnail.startsWith("http")
      ? { ...r, thumbnail: byPath.get(r.thumbnail) ?? null }
      : r,
  );
}

/** Public catalogue — lesson content is metadata only; playback remains protected. */
export const listPublicVideos = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("videos")
    .select(VIDEO_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error("بارگذاری ویدیوها ممکن نشد.");
  return await signThumbnails(normalizeVideoRows((data ?? []) as Array<Record<string, unknown>>));
});

export const listFreeVideos = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("videos")
    .select(VIDEO_COLUMNS)
    .eq("access_type", "free")
    .order("created_at", { ascending: false });
  return await signThumbnails(normalizeVideoRows((data ?? []) as Array<Record<string, unknown>>));
});

export const listAllVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("videos")
      .select(VIDEO_COLUMNS)
      .order("created_at", { ascending: false });
    return await signThumbnails(normalizeVideoRows((data ?? []) as Array<Record<string, unknown>>));
  });

export const getVideoPlaybackUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { videoId: string; accessToken?: string }) => {
    const id = String(data?.videoId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("ویدیوی نامعتبر.");
    const accessToken = typeof data?.accessToken === "string" ? data.accessToken.trim() : "";
    return { videoId: id, accessToken };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: video, error } = await supabaseAdmin
      .from("videos")
      .select("id, title, access_type, video_url")
      .eq("id", data.videoId)
      .maybeSingle();
    if (error || !video) throw new Error("ویدیو پیدا نشد.");

    if (video.access_type === "free") {
      if (video.video_url.startsWith("http")) return { url: video.video_url, expiresIn: 0 };
      const { data: signed, error: signErr } = await supabaseAdmin.storage
        .from("premium-videos")
        .createSignedUrl(video.video_url, 60 * 60);
      if (signErr || !signed?.signedUrl) throw new Error("ساخت لینک پخش ممکن نشد.");
      return { url: signed.signedUrl, expiresIn: 3600 };
    }

    const token = data.accessToken;
    if (!token || token.split(".").length !== 3) throw new Error("SUBSCRIPTION_REQUIRED");

    const SUPABASE_URL = process.env["SUPABASE_URL"]!;
    const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const authed = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: (input, init) => {
          const h = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
          if (init?.headers) new Headers(init.headers).forEach((v, k) => h.set(k, v));
          if (SUPABASE_PUBLISHABLE_KEY.startsWith("sb_") && h.get("Authorization") === `Bearer ${SUPABASE_PUBLISHABLE_KEY}`) h.delete("Authorization");
          h.set("apikey", SUPABASE_PUBLISHABLE_KEY);
          h.set("Authorization", `Bearer ${token}`);
          return fetch(input, { ...init, headers: h });
        },
      },
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { data: claims, error: claimsErr } = await authed.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) throw new Error("SUBSCRIPTION_REQUIRED");
    const userId = claims.claims.sub as string;

    const { data: adminRole } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
    let isAdmin = adminRole === true || isConfiguredAdmin(claims.claims);

    if (!isAdmin) {
      const { data: adminUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      isAdmin = isConfiguredAdmin(adminUser.user?.email ? { email: adminUser.user.email } : null);
    }

    if (!isAdmin) {
      await supabaseAdmin.rpc("expire_subscriptions");
      const { data: allowed } = await authed.rpc("has_active_subscription", { _user_id: userId } as any);
      if (allowed !== true) throw new Error("SUBSCRIPTION_REQUIRED");
    }

    if (video.video_url.startsWith("http")) return { url: video.video_url, expiresIn: 0 };
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("premium-videos")
      .createSignedUrl(video.video_url, 60 * 60);
    if (signErr || !signed?.signedUrl) throw new Error("ساخت لینک پخش ممکن نشد.");
    return { url: signed.signedUrl, expiresIn: 3600 };
  });
