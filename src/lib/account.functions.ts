import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SubscriptionRow = {
  id: string;
  status: "pending" | "active" | "expired";
  start_date: string | null;
  end_date: string | null;
  payment_verified_at: string | null;
};

export type PaymentRow = {
  id: string;
  amount: number;
  payment_date: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type VideoDialogue = { en: string; fa: string; t: number };
export type VideoVocab = { en: string; fa: string };

export type VideoRow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  access_type: "free" | "premium";
  created_at: string;
  badge: string;
  dialogues: VideoDialogue[];
  vocab: VideoVocab[];
};

const CONFIGURED_ADMIN_EMAILS = new Set(["lak20ml@gmail.com"]);

export function isConfiguredAdmin(claims: { email?: unknown } | null | undefined) {
  return typeof claims?.email === "string" && CONFIGURED_ADMIN_EMAILS.has(claims.email.trim().toLowerCase());
}

function isConfiguredAdminEmail(email: unknown) {
  return typeof email === "string" && CONFIGURED_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

function clean(value: unknown, max = 400): string {
  if (typeof value !== "string") throw new Error("ورودی نامعتبر است.");
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) throw new Error("ورودی نامعتبر است.");
  return trimmed;
}

/** Profile + subscription + payment history for the signed-in member. */
export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.rpc("expire_subscriptions");

    const [profileRes, subRes, payRes, roleRes] = await Promise.all([
      context.supabase.from("profiles").select("id, name, email, created_at").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("subscriptions")
        .select("id, status, start_date, end_date, payment_verified_at")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("payments")
        .select("id, amount, payment_date, status, created_at")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);

    const subscription = (subRes.data ?? null) as SubscriptionRow | null;
    const isActive =
      !!subscription &&
      subscription.status === "active" &&
      !!subscription.end_date &&
      new Date(subscription.end_date).getTime() > Date.now();
    const profileEmail = profileRes.data?.email;
    const claimsEmail = context.claims?.email;

    return {
      profile: profileRes.data ?? { id: context.userId, name: "", email: "", created_at: "" },
      subscription,
      isActive,
      isAdmin:
        roleRes.data === true ||
        isConfiguredAdmin(context.claims) ||
        isConfiguredAdminEmail(profileEmail) ||
        isConfiguredAdminEmail(claimsEmail),
      payments: (payRes.data ?? []) as PaymentRow[],
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string }) => ({ name: clean(data?.name, 80) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").update({ name: data.name }).eq("id", context.userId);
    if (error) throw new Error("ذخیره نام ممکن نشد.");
    return { ok: true };
  });
