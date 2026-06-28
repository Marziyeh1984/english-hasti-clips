import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, FileText, CheckCircle2, Mail, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SocialLinks } from "@/components/SocialLinks";
import { Reveal } from "@/components/Reveal";
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
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-ink/25 px-2 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-blush-deep active:scale-95"
              >
                <span className="block text-[22px] font-extrabold text-ink">{s.n}</span>
                <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                  {s.l}
                </span>
              </div>
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
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-5">
            <ClipCard />
            <ClipCard2 />
            <ClipCard3 />
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
            {STEPS.map((s) => (
              <div
                key={s.t}
                className="group flex items-center gap-4 rounded-2xl border border-ink/20 p-4 transition-all duration-300 hover:bg-blush-deep active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-cream transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-active:scale-90">
                  <s.icon size={22} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-ink">{s.t}</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.d}</p>
                </div>
              </div>
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

function ClipCard() {
  const dialogues = [
    { en: "I got mixed up with loan sharks, man.", fa: "داداش، گرفتار رباخوارها شدم." },
    { en: "They won't back off.", fa: "ول‌کن ماجرا نیستن." },
    { en: "I'm trying to build an empire, okay?", fa: "دارم سعی می‌کنم یه کسب‌وکار بزرگ راه بندازم، باشه؟" },
    { en: "So you owe them $10,000.", fa: "پس ۱۰ هزار دلار بهشون بدهکاری؟" },
    { en: "Couldn't get the money anywhere else.", fa: "از هیچ جای دیگه‌ای نتونستم پول جور کنم." },
    {
      en: "I didn't know any black folks invest in their house music,",
      fa: "هیچ آدم سیاه‌پوستی رو نمی‌شناختم که حاضر باشه روی خانه موسیقی سرمایه‌گذاری کنه،",
    },
    {
      en: "so until I pay them back, they're gonna keep coming in.",
      fa: "برای همین تا وقتی پولشون رو پس ندم، مدام سر و کله‌شون پیدا می‌شه.",
    },
    { en: "What a money!", fa: "چه پولی؟! / این همه پول از کجا بیارم؟!" },
    { en: "No, I just...", fa: "نه، من فقط... / نه، منظورم اینه که..." },
  ];

  const vocab = [
    { en: "Loan shark", fa: "رباخوار / قرض‌دهنده غیرقانونی" },
    { en: "Back off", fa: "دست برداشتن، کوتاه آمدن" },
    { en: "Lay low", fa: "در اختفا ماندن، خود را پنهان کردن" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream">
      <div className="relative">
        <video
          controls
          playsInline
          preload="metadata"
          poster={heroAsset.url}
          className="aspect-video w-full bg-ink object-cover"
        >
          <source src={SITE.clipVideoUrl || clipVideo.url} type="video/mp4" />
        </video>
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-bold text-cream shadow-md">
          <PlayCircle size={14} /> Watch Free
        </span>
      </div>



      <div className="p-5">
        <span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">
          Clip 01 · Drama
        </span>
        <h3 className="mb-4 mt-3 text-lg font-extrabold text-ink">Loan Sharks</h3>

        <div className="flex flex-col gap-3">
          {dialogues.map((d, i) => (
            <div key={i} className="border-r-2 border-ink/25 pr-3.5">
              <p className="mb-1 text-sm font-medium italic text-ink">{d.en}</p>
              <p className="text-[13px] text-muted-foreground">{d.fa}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-ink/25 bg-blush p-4">
          <p className="mb-2.5 text-[11px] font-bold text-ink">💡 اصطلاحات این درس</p>
          <div className="flex flex-col gap-2">
            {vocab.map((v) => (
              <div key={v.en} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="whitespace-nowrap font-semibold text-ink">{v.en}</span>
                <span className="text-right text-muted-foreground">{v.fa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipCard2() {
  const dialogues = [
    { en: "Kelly, it's been a week. I was starting to worry.", fa: "کلی، یه هفته‌ست خبری ازت نبود. داشتم نگران می‌شدم." },
    { en: "No, I'm okay.", fa: "نه، خوبم." },
    { en: "My gallbladder was giving me trouble.", fa: "کیسه صفرا‌م اذیتم می‌کرد." },
    { en: "Oh.", fa: "اوه…" },
    { en: "How'd the little one like the locket?", fa: "اون کوچولوهه از اون گردنبند (گردنبندِ قاب‌دار) خوشش اومد؟" },
    { en: "Oh, I'm saving it for her birthday.", fa: "نه، گذاشتم برای تولدش / نگهش داشتم برای تولدش." },
    { en: "She'll love that. How much?", fa: "خیلی خوشحال میشه. چقدر شد؟" },
    { en: "Five bucks.", fa: "پنج دلار." },
  ];

  const vocab = [
    { en: "Locket", fa: "گردنبند قاب‌دار (جای عکس)" },
    { en: "The little one", fa: "کوچولو، بچه" },
    { en: "Five bucks", fa: "پنج دلار (محاوره)" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream">
      <video
        controls
        playsInline
        preload="metadata"
        poster={heroAsset.url}
        className="aspect-video w-full bg-ink object-cover"
      >
        <source src={clipVideo2.url} type="video/mp4" />
      </video>

      <div className="p-5">
        <span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">
          Clip 02 · Drama
        </span>
        <h3 className="mb-4 mt-3 text-lg font-extrabold text-ink">The Locket</h3>

        <div className="flex flex-col gap-3">
          {dialogues.map((d, i) => (
            <div key={i} className="border-r-2 border-ink/25 pr-3.5">
              <p className="mb-1 text-sm font-medium italic text-ink">{d.en}</p>
              <p className="text-[13px] text-muted-foreground">{d.fa}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-ink/25 bg-blush p-4">
          <p className="mb-2.5 text-[11px] font-bold text-ink">💡 اصطلاحات این درس</p>
          <div className="flex flex-col gap-2">
            {vocab.map((v) => (
              <div key={v.en} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="whitespace-nowrap font-semibold text-ink">{v.en}</span>
                <span className="text-right text-muted-foreground">{v.fa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipCard3() {
  const dialogues = [
    { en: "What's wrong?", fa: "چی شده؟" },
    { en: "What's happened?", fa: "چی اتفاق افتاده؟" },
    { en: "It's Nick.", fa: "درمورد نیکه." },
    { en: "He's having an affair.", fa: "داره به من خیانت می‌کنه / رابطه‌ی پنهانی داره." },
    { en: "I saw him with her. They were kissing in the street.", fa: "دیدمش با اون زن. داشتن تو خیابون همدیگه رو می‌بوسیدن." },
    { en: "It wasn't a friendly kiss.", fa: "اون یه بوسه‌ی دوستانه نبود." },
    { en: "So, it's okay for you, but not for him.", fa: "پس یعنی برای تو اوکیه، ولی برای اون نه؟" },
    { en: "I know what Sam's about, but this thing with Nick…", fa: "من می‌دونم سم چه آدمیه و داستانش چیه، ولی این قضیه‌ی نیک…" },
  ];

  const vocab = [
    { en: "Have an affair", fa: "رابطه‌ی پنهانی / خیانت داشتن" },
    { en: "A friendly kiss", fa: "بوسه‌ی دوستانه" },
    { en: "What someone's about", fa: "اینکه کسی چه‌جور آدمیه" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream">
      <video
        controls
        playsInline
        preload="metadata"
        poster={heroAsset.url}
        className="aspect-video w-full bg-ink object-cover"
      >
        <source src={clipVideo3.url} type="video/mp4" />
      </video>

      <div className="p-5">
        <span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">
          Clip 03 · Drama
        </span>
        <h3 className="mb-4 mt-3 text-lg font-extrabold text-ink">The Affair</h3>

        <div className="flex flex-col gap-3">
          {dialogues.map((d, i) => (
            <div key={i} className="border-r-2 border-ink/25 pr-3.5">
              <p className="mb-1 text-sm font-medium italic text-ink">{d.en}</p>
              <p className="text-[13px] text-muted-foreground">{d.fa}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-ink/25 bg-blush p-4">
          <p className="mb-2.5 text-[11px] font-bold text-ink">💡 اصطلاحات این درس</p>
          <div className="flex flex-col gap-2">
            {vocab.map((v) => (
              <div key={v.en} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="whitespace-nowrap font-semibold text-ink">{v.en}</span>
                <span className="text-right text-muted-foreground">{v.fa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
