import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Check, FileText, CheckCircle2, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE } from "@/lib/site";
import heroAsset from "@/assets/hero-chalkboard.jpeg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "English Hasti — یادگیری انگلیسی با فیلم و سریال" },
      {
        name: "description",
        content:
          "هر روز یک کلیپ کوتاه از فیلم‌های واقعی با دیالوگ انگلیسی، ترجمه دقیق فارسی و توضیح اصطلاحات — مستقیم در ایمیل شما.",
      },
      { property: "og:title", content: "English Hasti" },
      {
        property: "og:description",
        content: "یادگیری زبان انگلیسی با کلیپ‌های فیلم و سریال.",
      },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:image", content: heroAsset.url },
    ],
  }),
  component: Index,
});

const STATS = [
  { n: "۳۰", l: "کلیپ در ماه" },
  { n: "۱۰۰٪", l: "ترجمه فارسی" },
  { n: "روزانه", l: "ارسال ایمیل" },
];

const STEPS = [
  {
    icon: FileText,
    t: "ثبت‌نام و پرداخت",
    d: "اطلاعات رو وارد کنید و مبلغ رو کارت‌به‌کارت بزنید",
  },
  {
    icon: CheckCircle2,
    t: "فعال‌سازی ظرف ۲۴ ساعت",
    d: "بعد از تأیید پرداخت، اشتراک شما فعال می‌شه",
  },
  {
    icon: Mail,
    t: "دریافت روزانه ایمیل",
    d: "روزانه یک کلیپ با ترجمه و توضیح اصطلاحات",
  },
];

const PLAN_FEATURES = [
  "روزانه ۱ کلیپ یا درس کوتاه",
  "ترجمه فارسی و انگلیسی",
  "توضیح اصطلاحات کاربردی",
  "ارسال ایمیل روزانه آموزشی",
  "بدون نیاز به ورود به سایت",
];

function Index() {
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      {/* HERO */}
      <section className="px-5 pt-8 text-center">
        <span className="mb-5 inline-block rounded-full bg-green-chip px-4 py-1.5 text-xs font-medium text-gold">
          🎬 یادگیری از فیلم‌های واقعی
        </span>
        <h1 className="text-[28px] font-bold leading-[1.55] sm:text-[34px]">
          یادگیری زبان انگلیسی
          <br />
          با <span className="text-gold">کلیپ‌های فیلم</span>
          <br />
          و سریال
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-muted-foreground">
          هر روز یک کلیپ کوتاه از فیلم‌های واقعی — با دیالوگ انگلیسی، ترجمه دقیق
          فارسی، و توضیح اصطلاحات کاربردی — مستقیم در ایمیل شما.
        </p>

        {/* Hero image */}
        <div className="relative mx-auto mt-7 max-w-md overflow-hidden rounded-3xl border border-border shadow-float">
          <img
            src={heroAsset.url}
            alt="نوشتن کلمه family با گچ روی تخته سیاه"
            className="h-[300px] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-right">
            <p className="text-sm font-medium text-foreground">
              کلمه‌ها رو همون‌جوری یاد بگیر که توی فیلم‌ها استفاده می‌شن.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-7 flex max-w-md flex-col gap-3">
          <Link
            to="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-[15px] font-bold text-background transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft size={18} /> دریافت اشتراک ماهانه
          </Link>
          <a
            href="#lessons"
            className="w-full rounded-full border border-border py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-green-chip"
          >
            مشاهده نمونه کلیپ‌ها
          </a>
        </div>

        {/* STATS */}
        <div className="mx-auto mt-9 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border">
          {STATS.map((s) => (
            <div key={s.l} className="bg-bg2 px-2 py-4">
              <span className="block text-[22px] font-bold text-gold">{s.n}</span>
              <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* LESSONS */}
      <section id="lessons" className="mt-14 px-5">
        <div className="mb-5 text-right">
          <span className="mb-2.5 inline-block rounded-full bg-green-chip px-3 py-1 text-[11px] text-muted-foreground">
            نمونه درس‌ها
          </span>
          <h2 className="text-[22px] font-bold leading-snug">یک کلیپ از کتابخانه‌ی ما</h2>
          <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
            هر درس شامل دیالوگ انگلیسی، ترجمه دقیق فارسی و توضیح اصطلاحات کاربردی است.
          </p>
        </div>

        <ClipCard />
      </section>

      {/* INVITE */}
      <section className="mt-9 px-5">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-green-chip px-6 py-7 text-center">
          <h3 className="text-lg font-bold">برای دریافت کلیپ‌های روزانه عضو شوید</h3>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-muted-foreground">
            روزانه یک درس جدید مستقیم به ایمیل شما. بدون نیاز به ورود به سایت.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft size={16} /> عضویت ماهانه
          </Link>
        </div>
      </section>

      {/* PLAN */}
      <section id="plan" className="mt-12 px-5">
        <div className="mb-5 text-right">
          <span className="mb-2.5 inline-block rounded-full bg-green-chip px-3 py-1 text-[11px] text-muted-foreground">
            پلن اشتراک
          </span>
          <h2 className="text-[22px] font-bold leading-snug">اشتراک ماهانه آموزش زبان</h2>
          <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
            ۳۰ کلیپ آموزشی در ماه + ترجمه + توضیح اصطلاحات، روزانه به ایمیل شما.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-3">
            {PLAN_FEATURES.map((f) => (
              <div key={f} className="flex items-center justify-end gap-3 text-sm">
                <span>{f}</span>
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-chip text-gold">
                  <Check size={13} />
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/signup"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft size={16} /> شروع اشتراک — {SITE.price}
          </Link>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mt-12 px-5">
        <div className="mb-5 text-right">
          <h2 className="text-[22px] font-bold leading-snug">چطور کار می‌کنه</h2>
          <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
            هر روز یک درس در ایمیل شما
          </p>
        </div>

        <div className="mx-auto flex max-w-md flex-col gap-3">
          {STEPS.map((s) => (
            <div
              key={s.t}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-chip text-gold">
                <s.icon size={22} />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-bold">{s.t}</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOLLOW */}
      <section className="mt-12 px-5">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-7 text-center">
          <h3 className="text-lg font-bold">ما را دنبال کنید</h3>
          <p className="mt-2 text-[13px] text-muted-foreground">
            کانال تلگرام و اینستاگرام English Hasti
          </p>
          <SocialLinks className="mt-5" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-border px-5 pt-8 text-center">
        <Link to="/" className="text-lg font-bold tracking-tight">
          English <span className="text-gold">Hasti</span>
        </Link>
        <p className="mb-2 mt-5 text-xs text-muted-foreground">ایمیل پشتیبانی</p>
        <p className="text-sm font-medium">{SITE.email}</p>
        <SocialLinks className="mt-5" />
      </footer>
    </div>
  );
}

function ClipCard() {
  const dialogues = [
    { en: "I got mixed up with loan sharks, man.", fa: "داداش، گرفتار رباخوارها شدم." },
    { en: "They won't back off.", fa: "ول‌کن ماجرا نیستن." },
    {
      en: "I'm trying to build an empire, okay?",
      fa: "دارم سعی می‌کنم یه کسب‌وکار بزرگ راه بندازم، باشه؟",
    },
    { en: "So you owe them $10,000.", fa: "پس ۱۰ هزار دلار بهشون بدهکاری؟" },
    {
      en: "Couldn't get the money anywhere else.",
      fa: "از هیچ جای دیگه‌ای نتونستم پول جور کنم.",
    },
  ];
  const vocab = [
    { en: "Loan shark", fa: "رباخوار / قرض‌دهنده غیرقانونی" },
    { en: "Back off", fa: "دست برداشتن، کوتاه آمدن" },
    { en: "Lay low", fa: "در اختفا ماندن، خود را پنهان کردن" },
  ];

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-video cursor-pointer bg-[#07120c]">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10">
          🎬
        </div>
        <div className="absolute bottom-3 right-4 text-[13px] text-border">DRAMA</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 text-background">
            <Play size={20} className="ms-0.5" />
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-green-chip px-2.5 py-1 text-[11px] text-muted-foreground">
            Clip 01 · Drama
          </span>
        </div>
        <h3 className="mb-4 text-lg font-bold">Loan Sharks</h3>

        <div className="flex flex-col gap-3">
          {dialogues.map((d, i) => (
            <div key={i} className="border-r-2 border-border pr-3.5">
              <p className="mb-1 text-sm italic">{d.en}</p>
              <p className="text-[13px] text-muted-foreground">{d.fa}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background p-4">
          <p className="mb-2.5 text-[11px] font-semibold text-gold">💡 اصطلاحات این درس</p>
          <div className="flex flex-col gap-2">
            {vocab.map((v) => (
              <div key={v.en} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="whitespace-nowrap font-medium">{v.en}</span>
                <span className="text-right text-muted-foreground">{v.fa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
