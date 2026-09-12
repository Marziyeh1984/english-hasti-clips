import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { VideoRow } from "./account.functions";

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

/** Covers live in a private bucket, so turn stored paths into short-lived links. */
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

/** Free videos — visible to everyone, no session required. Never returns video_url. */
export const listFreeVideos = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("videos")
    .select(VIDEO_COLUMNS)
    .eq("access_type", "free")
    .order("created_at", { ascending: false });
  return await signThumbnails((data ?? []) as VideoRow[]);
});

/** Full catalogue for signed-in members. Still never returns the raw file path. */
export const listAllVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("videos")
      .select(VIDEO_COLUMNS)
      .order("created_at", { ascending: false });
    return await signThumbnails((data ?? []) as VideoRow[]);
  });

/**
 * The only place a playable URL is ever produced.
 * Premium files live in a private bucket; a short-lived signed link is issued
 * only after the subscription is re-checked on the server.
 */
export const getVideoPlaybackUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { videoId: string }) => {
    const id = String(data?.videoId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("ویدیوی نامعتبر.");
    return { videoId: id };
  })
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: video, error } = await supabaseAdmin
      .from("videos")
      .select("id, title, access_type, video_url")
      .eq("id", data.videoId)
      .maybeSingle();
    if (error || !video) throw new Error("ویدیو پیدا نشد.");

    if (video.access_type === "premium") {
      await supabaseAdmin.rpc("expire_subscriptions");
      const { data: allowed } = await context.supabase.rpc("has_active_subscription", {
        _user_id: context.userId,
      });
      if (allowed !== true) {
        throw new Error("SUBSCRIPTION_REQUIRED");
      }
    }

    if (video.video_url.startsWith("http")) {
      return { url: video.video_url, expiresIn: 0 };
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("premium-videos")
      .createSignedUrl(video.video_url, 60 * 60);
    if (signErr || !signed?.signedUrl) throw new Error("ساخت لینک پخش ممکن نشد.");
    return { url: signed.signedUrl, expiresIn: 3600 };
  });
