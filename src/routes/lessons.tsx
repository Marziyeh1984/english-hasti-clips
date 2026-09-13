import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Play, Lock, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { LessonClip } from "@/components/LessonClip";
import { LESSONS } from "@/lib/lessons";
import { SITE } from "@/lib/site";
import { listPublicVideos, getVideoPlaybackUrl } from "@/lib/videos.functions";
import { getMyAccount } from "@/lib/account.functions";
import { Card } from "@/components/PageShell";

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

function isNew(createdAt: string) {
  const t = new Date(createdAt).getTime();
  return Number.isFinite(t) && Date.now() - t < 48 * 60 * 60 * 1000;
}

function LessonsPage() {
  const fetchVideos = useServerFn(listPublicVideos);
  const fetchAccount = useServerFn(getMyAccount);
  const play = useServerFn(getVideoPlaybackUrl);

  const [playing, setPlaying] = useState<{ title: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos", "public"],
    queryFn: () => fetchVideos(),
  });

  const { data: account } = useQuery({
    queryKey: ["account", "lessons"],
    queryFn: async () => {
      try {
        return await fetchAccount({});
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const isActive = (account as any)?.isActive === true;

  async function open(id: string) {
    setError("");
    setLoadingId(id);
    try {
      const res = await play({ data: { videoId: id } });
      const v = videos?.find((x) => x.id === id);
      setPlaying({ title: v?.title ?? "", url: res.url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        /SUBSCRIPTION_REQUIRED/.test(msg)
          ? "این درس ویژه است — برای تماشا نیاز به اشتراک فعال داری."
          : "پخش ویدیو ممکن نشد.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  const hasDbVideos = !!videos && videos.length > 0;

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
            {hasDbVideos
              ? " ویدیوهای رایگان برای همه قابل پخش است، ویدیوهای ویژه با برچسب «ویژه» فقط با اشتراک فعال باز می‌شود."
              : ""}
          </p>
          {isActive ? (
            <span className="mt-3 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white">
              اشتراک فعال — همه‌ی ویدیوهای ویژه باز است
            </span>
          ) : hasDbVideos ? (
            <Link
              to="/subscribe"
              className="mt-3 inline-flex rounded-full bg-ink px-5 py-2 text-[12px] font-bold text-cream"
            >
              فعال‌سازی اشتراک — {SITE.price}
            </Link>
          ) : null}
        </Reveal>

        {error && (
          <div className="rounded-2xl border-2 border-red-700/40 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-800">
            {error}
          </div>
        )}

        {isLoading && <p className="py-8 text-center text-sm text-ink/60">در حال بارگذاری…</p>}

        {/* DB uploads first (most recent) */}
        {hasDbVideos && (
          <div className="grid gap-4 lg:grid-cols-2">
            {videos!.map((v) => {
              const locked = v.access_type === "premium" && !isActive;
              return (
                <Card key={v.id} className="flex flex-col p-4">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-cream">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} loading="lazy" className="aspect-video w-full object-cover" />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center text-ink/30">
                        <Play size={34} />
                      </div>
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-cream">
                      {v.access_type === "free" ? "رایگان" : "ویژه"}
                    </span>
                    {isNew(v.created_at) && (
                      <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
                        جدید
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-base font-bold text-ink">{v.title}</h2>
                  {v.description && (
                    <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-ink/70">{v.description}</p>
                  )}
                  <div className="mt-auto pt-4">
                    {locked ? (
                      <Link
                        to="/subscribe"
                        className="flex items-center justify-center gap-1.5 rounded-full border-2 border-line px-4 py-2 text-[13px] font-bold text-ink transition-all hover:bg-blush-deep active:scale-95"
                      >
                        <Lock size={14} /> نیاز به اشتراک — قفل
                      </Link>
                    ) : (
                      <button
                        onClick={() => open(v.id)}
                        disabled={loadingId === v.id}
                        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-cream transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      >
                        <Play size={14} /> {loadingId === v.id ? "…" : "تماشا"}
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Original 14 clips always visible — labelled as free samples */}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-line" />
          <span className="rounded-full border border-ink/20 px-3 py-1 text-[11px] font-bold text-ink/70">۱۴ کلیپ اصلی — رایگان</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {LESSONS.map((l, i) => (
            <Reveal
              key={l.id}
              delay={i * 40}
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

        {/* Player modal */}
        {playing && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4"
            onClick={() => setPlaying(null)}
          >
            <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-cream">{playing.title}</span>
                <button
                  onClick={() => setPlaying(null)}
                  aria-label="بستن"
                  className="rounded-full bg-cream p-1.5 text-ink transition-all active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
              <video
                src={playing.url}
                controls
                autoPlay
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full rounded-2xl border-2 border-line bg-black"
              />
            </div>
          </div>
        )}

        <Reveal className="rounded-[28px] border-2 border-line bg-blush p-6 text-center lg:p-10">
          <h2 className="text-lg font-extrabold text-ink">هر روز یک الی دو درس تازه در اکانت شما</h2>
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
