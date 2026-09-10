import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { LessonClip } from "@/components/LessonClip";
import { LESSONS } from "@/lib/lessons";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "کتابخانه درس‌ها — English Hasti" },
      {
        name: "description",
        content:
          "همه‌ی کلیپ‌های آموزشی English Hasti در یک صفحه: دیالوگ انگلیسی، ترجمه فارسی و اصطلاحات کاربردی هر درس.",
      },
      { property: "og:title", content: "کتابخانه درس‌ها — English Hasti" },
      {
        property: "og:description",
        content: "همه‌ی کلیپ‌های آموزشی با ترجمه فارسی و توضیح اصطلاحات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 pt-4 lg:max-w-5xl lg:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-ink/70 transition-colors hover:text-ink"
        >
          <ArrowRight size={15} /> برگشت به صفحه اصلی
        </Link>

        <Reveal className="rounded-[28px] border-2 border-line bg-blush p-6 text-center lg:p-10">
          <span className="inline-block rounded-full border border-ink/30 px-3 py-1 text-[11px] text-ink">
            کتابخانه درس‌ها
          </span>
          <h1 className="mt-3 text-[26px] font-extrabold leading-snug text-ink lg:text-[34px]">
            همه‌ی کلیپ‌های آموزشی
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-7 text-muted-foreground">
            هر درس شامل ویدیو، دیالوگ انگلیسی هماهنگ با پخش، ترجمه فارسی و اصطلاحات
            شماره‌گذاری‌شده است.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          {LESSONS.map((l, i) => (
            <Reveal
              key={l.id}
              delay={i * 100}
              className="rounded-[28px] border-2 border-line bg-blush p-4 sm:p-6"
            >
              <LessonClip
                videoUrl={l.videoUrl}
                badge={l.badge}
                title={l.title}
                dialogues={l.dialogues}
                vocab={l.vocab}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="rounded-[28px] border-2 border-line bg-blush p-6 text-center lg:p-10">
          <h2 className="text-lg font-extrabold text-ink">
            هر روز یک الی دو درس تازه در اکانت شما
          </h2>
          <Link
            to="/auth"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
          >
            <ArrowLeft size={16} /> شروع اشتراک — {SITE.price}
          </Link>
        </Reveal>
      </main>
    </div>
  );
}
