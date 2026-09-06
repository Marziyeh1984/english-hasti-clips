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

export type VideoRow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  access_type: "free" | "premium";
  created_at: string;
};

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
    // Flip any subscription whose end_date has passed to "expired".
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

    return {
      profile: profileRes.data ?? { id: context.userId, name: "", email: "", created_at: "" },
      subscription,
      isActive,
      isAdmin: roleRes.data === true,
      payments: (payRes.data ?? []) as PaymentRow[],
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string }) => ({ name: clean(data?.name, 80) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ name: data.name })
      .eq("id", context.userId);
    if (error) throw new Error("ذخیره نام ممکن نشد.");
    return { ok: true };
  });

/** Member submits proof of a manual (card-to-card) payment. */
export const submitPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { amount: number; paymentDate: string; receiptPath: string; note?: string }) => {
    const amount = Number(data?.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
      throw new Error("مبلغ نامعتبر است.");
    }
    const paymentDate = clean(data?.paymentDate, 20);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) throw new Error("تاریخ نامعتبر است.");
    return {
      amount: Math.round(amount),
      paymentDate,
      receiptPath: clean(data?.receiptPath, 300),
      note: typeof data?.note === "string" ? data.note.slice(0, 300) : null,
    };
  })
  .handler(async ({ data, context }) => {
    // The receipt must live inside the member's own storage folder.
    if (!data.receiptPath.startsWith(`${context.userId}/`)) {
      throw new Error("فایل رسید نامعتبر است.");
    }

    const { error } = await context.supabase.from("payments").insert({
      user_id: context.userId,
      amount: data.amount,
      payment_date: data.paymentDate,
      receipt_path: data.receiptPath,
      note: data.note,
      status: "pending",
    });
    if (error) throw new Error("ثبت درخواست پرداخت ممکن نشد.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing || existing.status === "expired") {
      await supabaseAdmin.from("subscriptions").insert({ user_id: context.userId, status: "pending" });
    }

    return { ok: true };
  });
