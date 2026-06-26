import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  Clock,
  Mail,
  Copy,
  Check,
  Send,
  CheckCircle2,
} from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "ثبت اشتراک — English Hasti" },
      {
        name: "description",
        content: "ثبت‌نام اشتراک ماهانه English Hasti و دریافت روزانه کلیپ‌های آموزشی.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", telegram: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function copyCard() {
    const raw = SITE.cardNumber.replace(/\s/g, "");
    navigator.clipboard?.writeText(raw).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("لطفاً نام، ایمیل و شماره موبایل را وارد کنید.");
      return;
    }
    setError("");
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) return <ThankYou onHome={() => navigate({ to: "/" })} />;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-3 pb-14">
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-2 py-4 text-[13px] text-ink transition-opacity hover:opacity-70"
      >
        <ArrowRight size={16} /> بازگشت
      </button>

      <div className="rounded-[28px] border-2 border-line bg-blush p-6">
        <div className="text-center">
          <p className="font-script text-3xl font-bold text-ink">Sign Up</p>
          <h1 className="mt-1 text-[22px] font-extrabold text-ink">ثبت اشتراک</h1>
          <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-7 text-muted-foreground">
            اطلاعات خود را وارد کنید تا اشتراک فعال شود.
          </p>
        </div>

        {/* info chips */}
        <div className="mt-6 flex flex-col gap-2">
          <InfoChip icon={CreditCard} title="روش پرداخت" val="کارت‌به‌کارت" />
          <InfoChip icon={Clock} title="زمان فعال‌سازی" val="کمتر از ۲۴ ساعت" />
          <InfoChip icon={Mail} title="پشتیبانی" val={SITE.supportEmail} />
        </div>

        {/* form */}
        <div className="mt-5 flex flex-col gap-3.5">
          <Field label="نام و نام خانوادگی *" value={form.name} onChange={set("name")} />
          <Field
            label="ایمیل *"
            value={form.email}
            onChange={set("email")}
            type="email"
            ltr
            placeholder="example@email.com"
          />
          <Field
            label="شماره موبایل *"
            value={form.phone}
            onChange={set("phone")}
            ltr
            placeholder="09xxxxxxxxx"
          />
          <Field
            label="آیدی تلگرام (اختیاری)"
            value={form.telegram}
            onChange={set("telegram")}
            ltr
            placeholder="@username"
          />
        </div>

        {/* price */}
        <div className="mt-5 rounded-2xl border-2 border-ink bg-cream p-5 text-center">
          <p className="mb-1.5 text-xs text-muted-foreground">مبلغ اشتراک یک ماهه</p>
          <p className="text-[26px] font-extrabold text-ink">{SITE.price}</p>
          <p className="mt-1.5 text-[11px] leading-6 text-muted-foreground">
            پس از واریز، رسید را در تلگرام برای ادمین ارسال کنید
          </p>
        </div>

        {/* pay steps */}
        <div className="mt-4 rounded-2xl border border-ink/25 p-4">
          <p className="mb-3.5 text-center text-[13px] font-bold text-ink">مراحل پرداخت</p>
          {[
            "فرم بالا را کامل پر کنید",
            `مبلغ ${SITE.price} را به شماره کارت زیر واریز کنید`,
            "رسید پرداخت را به ادمین تلگرام بفرستید تا اشتراک فعال شود",
          ].map((t, i) => (
            <div
              key={i}
              className="mb-2.5 flex items-start justify-end gap-2.5 text-right text-[13px] leading-6 text-ink last:mb-0"
            >
              <span>{t}</span>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-cream">
                {["۱", "۲", "۳"][i]}
              </span>
            </div>
          ))}
        </div>

        {/* card */}
        <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-ink/25 bg-cream p-4">
          <button
            type="button"
            onClick={copyCard}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3 py-2 text-xs text-cream transition-opacity hover:opacity-90"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "کپی شد" : "کپی"}
          </button>
          <div className="text-right">
            <p className="mb-1 text-[11px] text-muted-foreground">
              شماره کارت — {SITE.cardHolder}
            </p>
            <p className="font-mono text-[15px] font-bold tracking-widest text-ink" dir="ltr">
              {SITE.cardNumber}
            </p>
          </div>
        </div>

        {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}

        <button
          type="button"
          onClick={submit}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-bold text-cream transition-opacity hover:opacity-90"
        >
          <ArrowRight size={18} /> ثبت اطلاعات و ادامه
        </button>
      </div>
    </div>
  );
}

function ThankYou({ onHome }: { onHome: () => void }) {
  const steps = [
    {
      icon: CreditCard,
      t: "پرداخت کارت‌به‌کارت",
      d: `مبلغ ${SITE.price} را به شماره کارت ثبت‌شده واریز کنید`,
    },
    { icon: Send, t: "ارسال رسید به تلگرام", d: "رسید پرداخت را به ادمین بفرستید تا اشتراک فعال شود" },
    { icon: Mail, t: "فعال‌سازی ظرف ۲۴ ساعت", d: "ایمیل اول شما تا فردا صبح ارسال می‌شود" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-3 pb-14 pt-8">
      <div className="rounded-[28px] border-2 border-line bg-blush p-7 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ink text-cream">
          <CheckCircle2 size={36} />
        </div>
        <p className="font-script text-3xl font-bold text-ink">Thank You!</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">ثبت‌نام شما انجام شد!</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-8 text-muted-foreground">
          اطلاعات شما دریافت شد. برای فعال‌سازی اشتراک، مبلغ را واریز کنید و رسید را به
          ادمین تلگرام ارسال کنید.
        </p>

        <div className="mt-7 flex flex-col gap-3 text-right">
          {steps.map((s) => (
            <div
              key={s.t}
              className="flex items-center justify-end gap-3.5 rounded-2xl border border-ink/20 p-4"
            >
              <div className="flex-1 text-right">
                <p className="text-sm font-bold text-ink">{s.t}</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.d}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-cream">
                <s.icon size={19} />
              </div>
            </div>
          ))}
        </div>

        <a
          href={SITE.telegramAdmin}
          target="_blank"
          rel="noreferrer"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-bold text-cream transition-opacity hover:opacity-90"
        >
          <Send size={18} /> ارسال رسید در تلگرام
        </a>

        <SocialLinks className="mt-6" />

        <button
          type="button"
          onClick={onHome}
          className="mt-6 w-full rounded-full border-2 border-line py-3.5 text-sm font-bold text-ink transition-colors hover:bg-blush-deep"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}

function InfoChip({
  icon: Icon,
  title,
  val,
}: {
  icon: typeof CreditCard;
  title: string;
  val: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 rounded-2xl border border-ink/20 p-3.5">
      <div className="text-right">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          {val}
        </p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-cream">
        <Icon size={17} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ltr = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  ltr?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={ltr ? "ltr" : "rtl"}
        className={`w-full rounded-full border-2 border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ink ${
          ltr ? "text-left" : "text-right"
        }`}
      />
    </div>
  );
}
