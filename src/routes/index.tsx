import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, FileText, CheckCircle2, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SocialLinks } from "@/components/SocialLinks";
import { Reveal } from "@/components/Reveal";
import { LessonClip, type Dialogue, type Vocab } from "@/components/LessonClip";
import { SITE } from "@/lib/site";
import heroAsset from "@/assets/hero-chalkboard.jpeg.asset.json";
import clipVideo from "@/assets/clip01.mp4.asset.json";
import clipVideo2 from "@/assets/clip02.mp4.asset.json";
import clipVideo3 from "@/assets/clip03.mp4.asset.json";

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
  { icon: Mail, t: "دریافت روزانه ایمیل", d: "روزانه یک کلیپ با ترجمه و توضیح اصطلاحات" },
];

const PLAN_FEATURES = [
  "روزانه ۱ کلیپ یا درس کوتاه",
  "ترجمه فارسی و انگلیسی",
  "توضیح اصطلاحات کاربردی",
  "ارسال ایمیل روزانه آموزشی",
  "بدون نیاز به ورود به سایت",
];

const CLIP1_DIALOGUES: Dialogue[] = [
  { en: "I got mixed up with loan sharks, man.", fa: "داداش، گرفتار رباخوارها شدم.", t: 0 },
  { en: "They won't back off.", fa: "ول‌کن ماجرا نیستن.", t: 2.12 },
  { en: "I'm trying to build an empire, okay?", fa: "دارم سعی می‌کنم یه کسب‌وکار بزرگ راه بندازم، باشه؟", t: 3.54 },
  { en: "So you owe them $10,000.", fa: "پس ۱۰ هزار دلار بهشون بدهکاری؟", t: 5.94 },
  { en: "Couldn't get the money anywhere else.", fa: "از هیچ جای دیگه‌ای نتونستم پول جور کنم.", t: 10.1 },
  {
    en: "I didn't know any black folks invest in their house music,",
    fa: "هیچ آدم سیاه‌پوستی رو نمی‌شناختم که حاضر باشه روی خانه موسیقی سرمایه‌گذاری کنه،",
    t: 11.9,
  },
  {
    en: "so until I pay them back, they're gonna keep coming in.",
    fa: "برای همین تا وقتی پولشون رو پس ندم، مدام سر و کله‌شون پیدا می‌شه.",
    t: 14.36,
  },
  { en: "What a money!", fa: "چه پولی؟! / این همه پول از کجا بیارم؟!", t: 16.3 },
  { en: "No, I just...", fa: "نه، من فقط... / نه، منظورم اینه که...", t: 17.0 },
];

const CLIP1_VOCAB: Vocab[] = [
  { en: "Loan shark", fa: "رباخوار / قرض‌دهنده غیرقانونی" },
  { en: "Back off", fa: "دست برداشتن، کوتاه آمدن" },
  { en: "Lay low", fa: "در اختفا ماندن، خود را پنهان کردن" },
];

const CLIP2_DIALOGUES: Dialogue[] = [
  { en: "Kelly, it's been a week. I was starting to worry.", fa: "کلی، یه هفته‌ست خبری ازت نبود. داشتم نگران می‌شدم.", t: 1.9 },
  { en: "No, I'm okay.", fa: "نه، خوبم.", t: 4.76 },
  { en: "My gallbladder was giving me trouble.", fa: "کیسه صفرا‌م اذیتم می‌کرد.", t: 5.8 },
  { en: "Oh.", fa: "اوه…", t: 8.88 },
  { en: "How'd the little one like the locket?", fa: "اون کوچولوهه از اون گردنبند (گردنبندِ قاب‌دار) خوشش اومد؟", t: 9.5 },
  { en: "Oh, I'm saving it for her birthday.", fa: "نه، گذاشتم برای تولدش / نگهش داشتم برای تولدش.", t: 12.36 },
  { en: "She'll love that. How much?", fa: "خیلی خوشحال میشه. چقدر شد؟", t: 15.1 },
  { en: "Five bucks.", fa: "پنج دلار.", t: 20.38 },
];

const CLIP2_VOCAB: Vocab[] = [
  { en: "Locket", fa: "گردنبند قاب‌دار (جای عکس)" },
  { en: "The little one", fa: "کوچولو، بچه" },
  { en: "Five bucks", fa: "پنج دلار (محاوره)" },
];

const CLIP3_DIALOGUES: Dialogue[] = [
  { en: "What's wrong?", fa: "چی شده؟", t: 0 },
  { en: "What's happened?", fa: "چی اتفاق افتاده؟", t: 1.6 },
  { en: "It's Nick.", fa: "درمورد نیکه.", t: 3.0 },
  { en: "He's having an affair.", fa: "داره به من خیانت می‌کنه / رابطه‌ی پنهانی داره.", t: 4.3 },
  { en: "I saw him with her. They were kissing in the street.", fa: "دیدمش با اون زن. داشتن تو خیابون همدیگه رو می‌بوسیدن.", t: 7.32 },
  { en: "It wasn't a friendly kiss.", fa: "اون یه بوسه‌ی دوستانه نبود.", t: 10.5 },
  { en: "So, it's okay for you, but not for him.", fa: "پس یعنی برای تو اوکیه، ولی برای اون نه؟", t: 13.32 },
  { en: "I know what Sam's about, but this thing with Nick…", fa: "من می‌دونم سم چه آدمیه و داستانش چیه، ولی این قضیه‌ی نیک…", t: 17.24 },
];

const CLIP3_VOCAB: Vocab[] = [
  { en: "Have an affair", fa: "رابطه‌ی پنهانی / خیانت داشتن" },
  { en: "A friendly kiss", fa: "بوسه‌ی دوستانه" },
  { en: "What someone's about", fa: "اینکه کسی چه‌جور آدمیه" },
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

      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-3 pt-4">
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
          <div className="mt-5 flex flex-col gap-5">
            <LessonClip
              videoUrl={SITE.clipVideoUrl || clipVideo.url}
              badge="Clip 01 · Drama"
              title="Loan Sharks"
              dialogues={CLIP1_DIALOGUES}
              vocab={CLIP1_VOCAB}
            />
            <LessonClip
              videoUrl={clipVideo2.url}
              badge="Clip 02 · Drama"
              title="The Locket"
              dialogues={CLIP2_DIALOGUES}
              vocab={CLIP2_VOCAB}
            />
            <LessonClip
              videoUrl={clipVideo3.url}
              badge="Clip 03 · Drama"
              title="The Affair"
              dialogues={CLIP3_DIALOGUES}
              vocab={CLIP3_VOCAB}
            />
          </div>
        </Card>

        {/* INVITE */}
        <Card className="text-center">
          <h3 className="font-script text-3xl font-bold text-ink">Join the Lessons</h3>
          <h4 className="mt-1 text-lg font-extrabold text-ink">
            برای دریافت کلیپ‌های روزانه عضو شوید
          </h4>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-muted-foreground">
            روزانه یک درس جدید مستقیم به ایمیل شما. بدون نیاز به ورود به سایت.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={16} /> عضویت ماهانه
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
              ۳۰ کلیپ آموزشی در ماه + ترجمه + توضیح اصطلاحات، روزانه به ایمیل شما.
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
            to="/signup"
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
