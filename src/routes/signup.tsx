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
    <div className="mx-auto min-h-screen max-w-md px-5 pb-14">
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-2 py-4 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight size={16} /> بازگشت
      </button>

      <div className="mb-7 border-b border-border pb-6 text-right">
        <h1 className="text-[22px] font-bold">ثبت اشتراک</h1>
        <p className="mt-1.5 text-[13px] leading-7 text-muted-foreground">
          اطلاعات خود را وارد کنید تا اشتراک فعال شود.
        </p>
      </div>

      {/* info chips */}
      <div className="mb-7 flex flex-col gap-2">
        <InfoChip icon={CreditCard} title="روش پرداخت" val="کارت‌به‌کارت" />
        <InfoChip icon={Clock} title="زمان فعال‌سازی" val="کمتر از ۲۴ ساعت" />
        <InfoChip icon={Mail} title="پشتیبانی" val={SITE.supportEmail} />
      </div>

      {/* form */}
      <div className="flex flex-col gap-3.5">
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
      <div className="mt-5 rounded-2xl border border-gold bg-background p-5 text-center">
        <p className="mb-1.5 text-xs text-muted-foreground">مبلغ اشتراک یک ماهه</p>
        <p className="text-[26px] font-bold text-gold">{SITE.price}</p>
        <p className="mt-1.5 text-[11px] leading-6 text-muted-foreground">
          پس از واریز، رسید را در تلگرام برای ادمین ارسال کنید
        </p>
      </div>

      {/* pay steps */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3.5 text-[13px] font-bold text-gold">مراحل پرداخت</p>
        {[
          "فرم بالا را کامل پر کنید",
          `مبلغ ${SITE.price} را به شماره کارت زیر واریز کنید`,
          "رسید پرداخت را به ادمین تلگرام بفرستید تا اشتراک فعال شود",
        ].map((t, i) => (
          <div
            key={i}
            className="mb-2.5 flex items-start justify-end gap-2.5 text-right text-[13px] leading-6 last:mb-0"
          >
            <span>{t}</span>
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-chip text-[11px] font-bold text-gold">
              {["۱", "۲", "۳"][i]}
            </span>
          </div>
        ))}
      </div>

      {/* card */}
      <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-border bg-background p-4">
        <button
          type="button"
          onClick={copyCard}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-green-chip px-3 py-2 text-xs text-gold transition-colors hover:bg-accent"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "کپی شد" : "کپی"}
        </button>
        <div className="text-right">
          <p className="mb-1 text-[11px] text-muted-foreground">
            شماره کارت — {SITE.cardHolder}
          </p>
          <p className="font-mono text-[15px] font-bold tracking-widest" dir="ltr">
            {SITE.cardNumber}
          </p>
        </div>
      </div>

      {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}

      <button
        type="button"
        onClick={submit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-[15px] font-bold text-background transition-transform hover:scale-[1.02]"
      >
        <ArrowRight size={18} /> ثبت اطلاعات و ادامه
      </button>
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
    {
      icon: Send,
      t: "ارسال رسید به تلگرام",
      d: "رسید پرداخت را به ادمین بفرستید تا اشتراک فعال شود",
    },
    {
      icon: Mail,
      t: "فعال‌سازی ظرف ۲۴ ساعت",
      d: "ایمیل اول شما تا فردا صبح ارسال می‌شود",
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-14 pt-14 text-center">
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-green-chip text-gold">
        <CheckCircle2 size={36} />
      </div>
      <h1 className="text-2xl font-bold">ثبت‌نام شما انجام شد!</h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-8 text-muted-foreground">
        اطلاعات شما دریافت شد. برای فعال‌سازی اشتراک، مبلغ را واریز کنید و رسید را به
        ادمین تلگرام ارسال کنید.
      </p>

      <div className="mt-8 flex flex-col gap-3 text-right">
        {steps.map((s) => (
          <div
            key={s.t}
            className="flex items-center justify-end gap-3.5 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex-1 text-right">
              <p className="text-sm font-medium">{s.t}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.d}</p>
            </div>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-chip text-gold">
              <s.icon size={19} />
            </div>
          </div>
        ))}
      </div>

      <a
        href={SITE.telegramAdmin}
        target="_blank"
        rel="noreferrer"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#229ED9] py-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
      >
        <Send size={18} /> ارسال رسید در تلگرام
      </a>

      <SocialLinks className="mt-6" />

      <button
        type="button"
        onClick={onHome}
        className="mt-6 w-full rounded-full border border-border py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-green-chip"
      >
        بازگشت به صفحه اصلی
      </button>
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
    <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card p-3.5">
      <div className="text-right">
        <p className="text-[13px] font-medium">{title}</p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          {val}
        </p>
      </div>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-chip text-gold">
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
      <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={ltr ? "ltr" : "rtl"}
        className={`w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold ${
          ltr ? "text-left" : "text-right"
        }`}
      />
    </div>
  );
}

function ThankYouFallback() {
  return null;
}
void ThankYouFallback;
