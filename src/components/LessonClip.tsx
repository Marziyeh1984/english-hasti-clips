import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlayCircle } from "lucide-react";
import { listPublicVideos, getVideoPlaybackUrl } from "@/lib/videos.functions";
import { supabase } from "@/integrations/supabase/client";

export type Dialogue = { en: string; fa: string; t: number };
export type Vocab = { en: string; fa: string };

export function LessonClip({
  videoUrl,
  poster,
  badge,
  title,
  dialogues,
  vocab,
}: {
  videoUrl: string;
  poster?: string;
  badge: string;
  title: string;
  dialogues: Dialogue[];
  vocab: Vocab[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lineRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(-1);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [videoError, setVideoError] = useState("");

  const fetchVideos = useServerFn(listPublicVideos);
  const playVideo = useServerFn(getVideoPlaybackUrl);
  const { data: videos, error: catalogError } = useQuery({
    queryKey: ["lesson-video-catalog"],
    queryFn: () => fetchVideos(),
    staleTime: 5 * 60 * 1000,
  });

  const dbVideo = videos?.find((v) => v.title.trim().toLowerCase() === title.trim().toLowerCase());

  useEffect(() => {
    let cancelled = false;

    async function resolveVideo() {
      setVideoError(catalogError ? "اتصال به سرویس ویدیو برقرار نشد." : "");
      if (!dbVideo) {
        setResolvedUrl("");
        return;
      }

      try {
        let accessToken = "";
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData.session?.access_token ?? "";

        const result = await playVideo({ data: { videoId: dbVideo.id, accessToken } });
        if (!cancelled) setResolvedUrl(result.url);
      } catch (error) {
        if (!cancelled) {
          setResolvedUrl("");
          setVideoError(
            error instanceof Error && /SUBSCRIPTION_REQUIRED/.test(error.message)
              ? "برای پخش این کلیپ اشتراک فعال لازم است."
              : "پخش ویدیو ممکن نشد. لطفاً دوباره صفحه را باز کنید.",
          );
        }
      }
    }

    void resolveVideo();
    return () => {
      cancelled = true;
    };
  }, [dbVideo?.id, playVideo, catalogError]);

  const handleTime = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let idx = -1;
    for (let i = 0; i < dialogues.length; i++) {
      if (dialogues[i].t <= t + 0.15) idx = i;
      else break;
    }
    if (idx !== active) {
      setActive(idx);
      const el = lineRefs.current[idx];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const seek = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = dialogues[i].t + 0.01;
    v.play().catch(() => {});
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream">
      <div className="relative">
        {resolvedUrl ? (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            onTimeUpdate={handleTime}
            onEnded={() => setActive(-1)}
            className="aspect-video w-full bg-ink object-cover"
          >
            <source src={resolvedUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-ink px-6 text-center text-cream">
            <div>
              <PlayCircle className="mx-auto mb-3" size={42} />
              <p className="text-sm font-bold">
                {videoError || (videos ? "این کلیپ هنوز به Storage سایت متصل نشده است." : "در حال آماده‌سازی ویدیو…")}
              </p>
              {!videoError && videos && !dbVideo && (
                <p className="mt-2 text-xs text-cream/70">مدیر سایت باید فایل این کلیپ را از پنل مدیریت آپلود کند.</p>
              )}
            </div>
          </div>
        )}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-bold text-cream shadow-md">
          <PlayCircle size={14} /> Watch
        </span>
      </div>

      <div className="p-5">
        <span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">{badge}</span>
        <h3 className="mb-4 mt-3 text-lg font-extrabold text-ink">{title}</h3>

        <div className="flex max-h-[340px] flex-col gap-1 overflow-y-auto pr-1">
          {dialogues.map((d, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                onClick={() => seek(i)}
                disabled={!resolvedUrl}
                className={`w-full rounded-lg border-r-2 pr-3.5 text-right transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive ? "border-ink bg-blush-deep px-3 py-2 shadow-sm" : "border-ink/25 px-0 py-1 hover:bg-blush-deep/50"
                }`}
              >
                <p className={`mb-1 text-sm italic transition-colors ${isActive ? "font-bold text-ink" : "font-medium text-ink"}`}>{d.en}</p>
                <p className="text-[13px] text-muted-foreground">{d.fa}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-ink/25 bg-blush p-4">
          <p className="mb-2.5 text-[11px] font-bold text-ink">💡 اصطلاحات این درس</p>
          <ol className="flex flex-col gap-2.5">
            {vocab.map((v, i) => (
              <li key={v.en} className="flex items-start gap-2.5 rounded-xl border border-ink/15 bg-cream/60 px-3 py-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-cream">{i + 1}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span dir="ltr" className="text-right text-xs font-semibold text-ink">{v.en}</span>
                  <span className="text-right text-[11px] leading-6 text-muted-foreground">{v.fa}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
