import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { submitPayment } from "@/lib/account.functions";
import { SITE } from "@/lib/site";
import { PageShell, Card, Field, PrimaryButton } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/subscribe")({
  head: () => ({
    meta: [
      { title: "خرید اشتراک — English Hasti" },
      {
        name: "description",
        content: "پرداخت کارت‌به‌کارت اشتراک ماهانه English Hasti و ارسال رسید برای فعال‌سازی.",
      },
      { property: "og:title", content: "خرید اشتراک — English Hasti" },
      { property: "og:description", content: "پرداخت کارت‌به‌کارت و ارسال رسید اشتراک." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubscribePage,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function SubscribePage() {
  const navigate = useNavigate();
  const send = useServerFn(submitPayment);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("490000");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function copyCard() {
    navigator.clipboard.writeText(SITE.cardNumber.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) return setError("لطفاً تصویر رسید را انتخاب کن.");
    if (file.size > 8 * 1024 * 1024) return setError("حجم فایل باید کمتر از ۸ مگابایت باشد.");
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("لطفاً دوباره وارد شو.");

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
      const path = `${uid}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, {
        contentType: file.type || "image/jpeg",
      });
      if (upErr) throw new Error("آپلود رسید ممکن نشد.");

      await send({
        data: { amount: Number(amount), paymentDate: date, receiptPath: path, note },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <PageShell>
        <Card className="mx-auto max-w-md text-center">
          <p className="font-script text-4xl text-ink">ممنون!</p>
          <p className="mt-3 text-sm leading-7 text-ink/80">
            رسید تو ثبت شد و در صف بررسی است. بعد از تأیید، اشتراکت فعال می‌شود و در داشبورد
            می‌بینی.
          </p>
          <PrimaryButton className="mt-5" onClick={() => navigate({ to: "/dashboard" })}>
            رفتن به داشبورد
          </PrimaryButton>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="text-center font-script text-5xl text-ink">خرید اشتراک</h1>
      <p className="mt-2 text-center text-sm text-ink/70">
        مبلغ اشتراک ماهانه: <span className="font-bold text-ink">{SITE.price}</span>
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-ink">۱. پرداخت کارت‌به‌کارت</h2>
          <p className="mt-2 text-[13px] text-ink/70">مبلغ را به کارت زیر واریز کن:</p>
          <button
            onClick={copyCard}
            className="mt-3 flex w-full items-center justify-between gap-2 rounded-2xl border-2 border-line bg-cream px-4 py-3 transition-all hover:bg-blush-deep/40 active:scale-[0.98]"
          >
            <span dir="ltr" className="font-mono text-lg tracking-wider text-ink">
              {SITE.cardNumber}
            </span>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <p className="mt-2 text-[13px] text-ink/70">به نام: {SITE.cardHolder}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink">۲. ارسال رسید</h2>
          <form onSubmit={submit} className="mt-3 flex flex-col gap-3">
            <Field
              label="مبلغ پرداختی (تومان)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              dir="ltr"
            />
            <Field
              label="تاریخ پرداخت"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              dir="ltr"
            />
            <Field
              label="توضیح (اختیاری)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-cream px-4 py-3 text-[13px] font-semibold text-ink transition-all hover:bg-blush-deep/30">
              <Upload size={16} />
              {file ? file.name : "انتخاب تصویر رسید"}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {error && <p className="text-[13px] font-semibold text-red-700">{error}</p>}

            <PrimaryButton type="submit" disabled={busy}>
              {busy ? "در حال ارسال…" : "ثبت رسید"}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
