import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isConfiguredAdmin } from "./account.functions";
import { packLessonDescription, unpackLessonDescription } from "./video-lesson-meta";

export type AdminPayment = {
  id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  name: string;
  email: string;
  receiptUrl: string | null;
};

export type AdminDialogue = { en: string; fa: string; t: number };
export type AdminVocab = { en: string; fa: string };

async function assertAdmin(context: { supabase: any; userId: string; claims?: any }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data === true || isConfiguredAdmin(context.claims)) return;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .eq("id", context.userId)
    .maybeSingle();
  const email = typeof profile?.email === "string" ? profile.email.trim().toLowerCase() : "";
  if (email === "lak20ml@gmail.com") return;

  throw new Error("Forbidden");
}

function str(v: unknown, max: number) {
  if (typeof v !== "string") throw new Error("ورودی نامعتبر است.");
  const t = v.trim();
  if (!t || t.length > max) throw new Error("ورودی نامعتبر است.");
  return t;
}

function parseDialogues(value: unknown): AdminDialogue[] {
  if (!Array.isArray(value) || value.length > 1000) throw new Error("دیالوگ‌ها نامعتبر هستند.");
  const rows = value.filter((item) => {
    if (!item || typeof item !== "object") return true;
    const x = item as Record<string, unknown>;
    const en = typeof x.en === "string" ? x.en.trim() : "";
    const fa = typeof x.fa === "string" ? x.fa.trim() : "";
    const rawT = x.t;
    const t = rawT === "" || rawT === null || rawT === undefined ? 0 : Number(rawT);
    return en !== "" || fa !== "" || t !== 0;
  });
  return rows.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`دیالوگ ${index + 1} نامعتبر است.`);
    const x = item as Record<string, unknown>;
    const en = str(x.en, 1000);
    const fa = str(x.fa, 2000);
    const t = Number(x.t);
    if (!Number.isFinite(t) || t < 0 || t > 86400) throw new Error(`زمان دیالوگ ${index + 1} نامعتبر است.`);
    return { en, fa, t };
  }).sort((a, b) => a.t - b.t);
}

function parseVocab(value: unknown): AdminVocab[] {
  if (!Array.isArray(value) || value.length > 500) throw new Error("اصطلاحات نامعتبر هستند.");
  const rows = value.filter((item) => {
    if (!item || typeof item !== "object") return true;
    const x = item as Record<string, unknown>;
    const en = typeof x.en === "string" ? x.en.trim() : "";
    const fa = typeof x.fa === "string" ? x.fa.trim() : "";
    return en !== "" || fa !== "";
  });
  return rows.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`اصطلاح ${index + 1} نامعتبر است.`);
    const x = item as Record<string, unknown>;
    return { en: str(x.en, 300), fa: str(x.fa, 1000) };
  });
}

const UUID = /^[0-9a-f-]{36}$/i;

export const listPaymentRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: payments } = await supabaseAdmin.from("payments").select("id, user_id, amount, payment_date, note, status, created_at, receipt_path").order("created_at", { ascending: false });
    const rows = payments ?? [];
    const ids = [...new Set(rows.map((r) => r.user_id))];
    const { data: profiles } = ids.length ? await supabaseAdmin.from("profiles").select("id, name, email").in("id", ids) : { data: [] as { id: string; name: string; email: string }[] };
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
    const result: AdminPayment[] = [];
    for (const r of rows) {
      const { data: signed } = await supabaseAdmin.storage.from("receipts").createSignedUrl(r.receipt_path, 60 * 30);
      const p = byId.get(r.user_id);
      result.push({ id: r.id, user_id: r.user_id, amount: Number(r.amount), payment_date: r.payment_date, note: r.note, status: r.status, created_at: r.created_at, name: p?.name ?? "", email: p?.email ?? "", receiptUrl: signed?.signedUrl ?? null });
    }
    return result;
  });

export const approvePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { paymentId: string; days: number }) => {
    const paymentId = String(data?.paymentId ?? "");
    if (!UUID.test(paymentId)) throw new Error("درخواست نامعتبر.");
    const days = Number(data?.days);
    if (!Number.isFinite(days) || days < 1 || days > 3650) throw new Error("مدت نامعتبر.");
    return { paymentId, days: Math.round(days) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: payment } = await supabaseAdmin.from("payments").select("id, user_id, status").eq("id", data.paymentId).maybeSingle();
    if (!payment) throw new Error("درخواست پیدا نشد.");
    const now = new Date();
    await supabaseAdmin.from("payments").update({ status: "approved", reviewed_at: now.toISOString(), reviewed_by: context.userId }).eq("id", payment.id);
    const { data: sub } = await supabaseAdmin.from("subscriptions").select("id, status, end_date").eq("user_id", payment.user_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const base = sub?.status === "active" && sub.end_date && new Date(sub.end_date) > now ? new Date(sub.end_date) : now;
    const end = new Date(base.getTime() + data.days * 24 * 60 * 60 * 1000);
    const patch = { status: "active" as const, start_date: (sub?.status === "active" ? sub.end_date : null) ? sub!.end_date : now.toISOString(), end_date: end.toISOString(), payment_verified_at: now.toISOString() };
    if (sub) await supabaseAdmin.from("subscriptions").update(patch).eq("id", sub.id);
    else await supabaseAdmin.from("subscriptions").insert({ user_id: payment.user_id, ...patch });
    return { ok: true, endDate: end.toISOString() };
  });

export const rejectPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { paymentId: string }) => {
    const paymentId = String(data?.paymentId ?? "");
    if (!UUID.test(paymentId)) throw new Error("درخواست نامعتبر.");
    return { paymentId };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("payments").update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: context.userId }).eq("id", data.paymentId);
    return { ok: true };
  });

export const adminListVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("videos").select("id, title, description, thumbnail, video_url, access_type, created_at").order("created_at", { ascending: false });
    return (data ?? []).map((row) => {
      const unpacked = unpackLessonDescription(row.description);
      return { ...row, description: unpacked.description, badge: unpacked.meta.badge, dialogues: unpacked.meta.dialogues, vocab: unpacked.meta.vocab };
    });
  });

export const adminCreateUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { kind: "video" | "thumbnail"; fileName: string }) => {
    const kind = data?.kind === "thumbnail" ? ("thumbnail" as const) : ("video" as const);
    const name = str(data?.fileName, 200);
    const ext = (name.split(".").pop() || (kind === "video" ? "mp4" : "jpg")).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
    return { kind, ext: ext || (kind === "video" ? "mp4" : "jpg") };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bucket = data.kind === "video" ? "premium-videos" : "thumbnails";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${data.ext}`;
    const { data: signed, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path);
    if (error || !signed) throw new Error("ساخت لینک آپلود ممکن نشد.");
    return { bucket, path, token: signed.token };
  });

export const adminCreateVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl: string;
    accessType: "free" | "premium";
    badge?: string;
    dialogues?: unknown;
    vocab?: unknown;
  }) => ({
    title: str(data?.title, 160),
    description: typeof data?.description === "string" ? data.description.slice(0, 2000) : "",
    thumbnail: typeof data?.thumbnail === "string" && data.thumbnail.trim() ? data.thumbnail.trim().slice(0, 500) : null,
    videoUrl: str(data?.videoUrl, 500),
    accessType: data?.accessType === "free" ? ("free" as const) : ("premium" as const),
    badge: typeof data?.badge === "string" && data.badge.trim() ? data.badge.trim().slice(0, 80) : "درس جدید",
    dialogues: parseDialogues(data?.dialogues ?? []),
    vocab: parseVocab(data?.vocab ?? []),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const description = packLessonDescription(data.description, {
      badge: data.badge,
      dialogues: data.dialogues,
      vocab: data.vocab,
    });
    const { error } = await supabaseAdmin.from("videos").insert({
      title: data.title,
      description,
      thumbnail: data.thumbnail,
      video_url: data.videoUrl,
      access_type: data.accessType,
    });
    if (error) throw new Error("ثبت ویدیو ممکن نشد.");
    return { ok: true };
  });

export const adminSetVideoAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { videoId: string; accessType: "free" | "premium" }) => {
    const videoId = String(data?.videoId ?? "");
    if (!UUID.test(videoId)) throw new Error("ویدیوی نامعتبر.");
    const accessType = data?.accessType === "free" ? ("free" as const) : ("premium" as const);
    return { videoId, accessType };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("videos").update({ access_type: data.accessType }).eq("id", data.videoId);
    if (error) throw new Error("تغییر دسترسی ویدیو ممکن نشد.");
    return { ok: true };
  });

export const adminDeleteVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { videoId: string }) => {
    const videoId = String(data?.videoId ?? "");
    if (!UUID.test(videoId)) throw new Error("ویدیوی نامعتبر.");
    return { videoId };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("videos").delete().eq("id", data.videoId);
    return { ok: true };
  });
