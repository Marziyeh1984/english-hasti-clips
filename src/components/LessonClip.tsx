import { useRef, useState } from "react";
import { PlayCircle } from "lucide-react";

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
          <source src={videoUrl} type="video/mp4" />
        </video>
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-bold text-cream shadow-md">
          <PlayCircle size={14} /> Watch Free
        </span>
      </div>

      <div className="p-5">
        <span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">
          {badge}
        </span>
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
                className={`w-full rounded-lg border-r-2 pr-3.5 text-right transition-all duration-300 ${
                  isActive
                    ? "border-ink bg-blush-deep px-3 py-2 shadow-sm"
                    : "border-ink/25 px-0 py-1 hover:bg-blush-deep/50"
                }`}
              >
                <p
                  className={`mb-1 text-sm italic transition-colors ${
                    isActive ? "font-bold text-ink" : "font-medium text-ink"
                  }`}
                >
                  {d.en}
                </p>
                <p className="text-[13px] text-muted-foreground">{d.fa}</p>
              </button>
            );
          })}
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
