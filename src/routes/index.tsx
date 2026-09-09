import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, FileText, CheckCircle2, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SocialLinks } from "@/components/SocialLinks";
import { Reveal } from "@/components/Reveal";
import { LessonClip } from "@/components/LessonClip";
import { LESSONS } from "@/lib/lessons";
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
  { icon: FileText, t: "ثبت‌نام و پرداخت", d: "اطلاعات رو وارد کنید و مبلغ رو کارت‌به‌کارت بزنید" },
  { icon: CheckCircle2, t: "فعال‌سازی ظرف ۲۴ ساعت", d: "بعد از تأیید پرداخت، اشتراک شما فعال می‌شه" },
  { icon: Mail, t: "دریافت روزانه ویدیوها به اکانت شما", d: "روزانه یک الی دو کلیپ با ترجمه و توضیح اصطلاحات" },
];

const PLAN_FEATURES = [
  "روزانه ۱ الی ۲ کلیپ یا درس کوتاه",
  "ترجمه فارسی و انگلیسی",
  "توضیح اصطلاحات کاربردی",
  "شروع اشتراک ۲۹۰ هزار تومان",
];

function Card({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Reveal
      id={id}
      className={`rounded-[28px] border-2 border-line bg-blush p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </Reveal>
  );
}

function Index() {
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 pt-4 lg:max-w-5xl lg:px-6">
        {/* HERO */}
        <Card className="text-center">
          <span className="inline-block rounded-full border border-ink/30 px-4 py-1.5 text-xs font-medium text-ink">
            🎬 یادگیری از فیلم‌های واقعی
          </span>
          <h1 className="mt-5 text-[30px] font-extrabold leading-[1.5] text-ink sm:text-[36px]">
            یادگیری زبان انگلیسی با کلیپ‌های فیلم و سریال
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-muted-foreground">
            هر روز یک کلیپ کوتاه از فیلم‌های واقعی — با دیالوگ انگلیسی، ترجمه دقیق
            فارسی، و توضیح اصطلاحات کاربردی — مستقیم در ایمیل شما.
          </p>

          <div className="relative mt-6 overflow-hidden rounded-[22px] border-2 border-line">
            <img
              src={heroAsset.url}
              alt="نوشتن کلمه family با گچ روی تخته سیاه"
              className="h-[280px] w-full object-cover"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/signup"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-bold text-cream transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95"
            >
              <ArrowLeft size={18} /> دریافت اشتراک ماهانه
            </Link>
            <a
              href="#lessons"
              className="w-full rounded-full border-2 border-line py-3.5 text-sm font-bold text-ink transition-all duration-300 hover:bg-blush-deep active:scale-95"
            >
              مشاهده نمونه کلیپ‌ها
            </a>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {STATS.map((s, i) => (
              <Reveal
                key={s.l}
                delay={i * 140}
                className="rounded-2xl border border-ink/25 px-2 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-blush-deep active:scale-95"
              >
                <span className="block text-[22px] font-extrabold text-ink">{s.n}</span>
                <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                  {s.l}
                </span>
              </Reveal>
            ))}
          </div>
        </Card>

        {/* LESSONS */}
        <Card id="lessons">
          <div className="text-center">
            <span className="inline-block rounded-full border border-ink/30 px-3 py-1 text-[11px] text-ink">
              نمونه درس‌ها
            </span>
            <h2 className="mt-3 text-[24px] font-extrabold leading-snug text-ink">
              یک کلیپ از کتابخانه‌ی ما
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-7 text-muted-foreground">
              هر درس شامل دیالوگ انگلیسی، ترجمه دقیق فارسی و توضیح اصطلاحات کاربردی است.
              هنگام پخش، دیالوگِ در حالِ گفته‌شدن هایلایت می‌شود — با کلیک روی هر جمله، ویدیو به همان لحظه می‌رود.
            </p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {LESSONS.slice(0, 2).map((l) => (
              <LessonClip
                key={l.id}
                videoUrl={l.id === "clip01" ? SITE.clipVideoUrl || l.videoUrl : l.videoUrl}
                badge={l.badge}
                title={l.title}
                dialogues={l.dialogues}
                vocab={l.vocab}
              />
            ))}
          </div>
          <Link
            to="/lessons"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-line py-3.5 text-sm font-bold text-ink transition-all duration-300 hover:bg-blush-deep active:scale-95"
          >
            <ArrowLeft size={16} /> مشاهده همه‌ی درس‌ها
          </Link>

        </Card>

        {/* INVITE */}
        <Card className="text-center">
          <h3 className="font-script text-3xl font-bold text-ink">Join the Lessons</h3>
          <h4 className="mt-1 text-lg font-extrabold text-ink">
            برای دریافت کلیپ‌های روزانه عضو شوید
          </h4>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-muted-foreground">
            روزانه یک الی دو درس جدید مستقیم به اکانت شما.
          </p>
          <Link
            to="/auth"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} /> ورود / عضویت
          </Link>
        </Card>

        {/* PLAN */}
        <Card id="plan">
          <div className="text-center">
            <span className="inline-block rounded-full border border-ink/30 px-3 py-1 text-[11px] text-ink">
              پلن اشتراک
            </span>
            <h2 className="mt-3 text-[24px] font-extrabold leading-snug text-ink">
              اشتراک ماهانه آموزش زبان
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-7 text-muted-foreground">
              ۳۰ کلیپ آموزشی در ماه + ترجمه + توضیح اصطلاحات، روزانه به اکانت شما.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {PLAN_FEATURES.map((f) => (
              <div
                key={f}
                className="group flex items-center justify-end gap-3 rounded-2xl border border-ink/20 px-4 py-3 text-sm text-ink transition-all duration-300 hover:bg-blush-deep active:scale-[0.98]"
              >
                <span>{f}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
                  <Check size={13} />
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/auth"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold text-cream transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95"
          >
            <ArrowLeft size={16} /> شروع اشتراک — {SITE.price}
          </Link>
        </Card>

        {/* HOW */}
        <Card id="how">
          <div className="text-center">
            <h2 className="text-[24px] font-extrabold leading-snug text-ink">چطور کار می‌کنه</h2>
            <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
              هر روز یک درس در ایمیل شما
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.t}
                delay={i * 160}
                className="group flex items-center gap-4 rounded-2xl border border-ink/20 p-4 transition-all duration-300 hover:bg-blush-deep active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-cream transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90">
                  <s.icon size={22} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-ink">{s.t}</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Card>

        {/* FOOTER CARD */}
        <Card className="text-center">
          <p className="font-script text-4xl font-bold text-ink">English Hasti</p>
          <SocialLinks className="mt-4" />
          <div className="mx-auto my-5 h-px w-16 bg-ink/20" />
          <p className="text-xs text-muted-foreground">ایمیل پشتیبانی</p>
          <p className="mt-1 text-sm font-semibold text-ink" dir="ltr">
            {SITE.email}
          </p>
        </Card>
      </main>
    </div>
  );
}
