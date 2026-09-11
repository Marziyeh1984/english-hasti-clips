import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Play, X } from "lucide-react";
import { listAllVideos, getVideoPlaybackUrl } from "@/lib/videos.functions";
import { getMyAccount } from "@/lib/account.functions";
import { PageShell, Card, StatusPill, BackToHome } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "کتابخانه ویدیوها — English Hasti" },
      { name: "description", content: "همه‌ی درس‌های رایگان و ویژه English Hasti در یک‌جا." },
      { property: "og:title", content: "کتابخانه ویدیوها — English Hasti" },
      { property: "og:description", content: "درس‌های رایگان و ویژه English Hasti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

/** A lesson added in the last 48 hours gets a "new" badge. */
function isNew(createdAt: string) {
  const t = new Date(createdAt).getTime();
  return Number.isFinite(t) && Date.now() - t < 48 * 60 * 60 * 1000;
}

function LibraryPage() {
  const fetchVideos = useServerFn(listAllVideos);
  const fetchAccount = useServerFn(getMyAccount);
  const play = useServerFn(getVideoPlaybackUrl);

  const [playing, setPlaying] = useState<{ title: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: account } = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos", "all"],
    queryFn: () => fetchVideos({}),
  });

  const isActive = account?.isActive === true;

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

  return (
    <PageShell>
      <BackToHome className="mb-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-script text-5xl text-ink">کتابخانه ویدیوها</h1>
        {isActive ? (
          <StatusPill tone="ok">اشتراک فعال</StatusPill>
        ) : (
          <Link
            to="/subscribe"
            className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition-all hover:scale-105 active:scale-95"
          >
            فعال‌سازی اشتراک
          </Link>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border-2 border-red-700/40 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-800">
          {error}
        </div>
      )}

      {isLoading && <p className="mt-8 text-sm text-ink/60">در حال بارگذاری…</p>}

      {videos && videos.length === 0 && (
        <p className="mt-8 text-sm text-ink/60">هنوز ویدیویی اضافه نشده است.</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos?.map((v) => {
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
                    <Lock size={14} /> نیاز به اشتراک
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
    </PageShell>
  );
}
