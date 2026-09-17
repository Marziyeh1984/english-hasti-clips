import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { LessonClip } from "@/components/LessonClip";
import { LESSONS } from "@/lib/lessons";
import { SITE } from "@/lib/site";
import { listPublicVideos } from "@/lib/videos.functions";
import { getMyAccount } from "@/lib/account.functions";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [
    { title: "کتابخانه درس‌ها — English Hasti" },
    { name: "description", content: "همه‌ی کلیپ‌های آموزشی English Hasti با دیالوگ انگلیسی، ترجمه فارسی و اصطلاحات کاربردی." },
  ] }),
  component: LessonsPage,
});

function LessonsPage() {
  const fetchVideos = useServerFn(listPublicVideos);
  const fetchAccount = useServerFn(getMyAccount);
  const { data: videos, isLoading } = useQuery({ queryKey: ["videos", "public"], queryFn: () => fetchVideos() });
  const { data: account } = useQuery({ queryKey: ["account", "lessons"], queryFn: async () => { try { return await fetchAccount({}); } catch { return null; } }, retry: false });
  const isActive = (account as any)?.isActive === true;
  const hasDbVideos = !!videos && videos.length > 0;

  return <div className="min-h-screen pb-12">
    <Navbar />
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 pt-4 lg:max-w-5xl lg:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-ink/70 hover:text-ink"><ArrowRight size={15} /> برگشت به صفحه اصلی</Link>
      <Reveal className="rounded-[28px] border-2 border-line bg-blush p-6 text-center lg:p-10">
        <span className="inline-block rounded-full border border-ink/30 px-3 py-1 text-[11px] text-ink">کتابخانه درس‌ها</span>
        <h1 className="mt-3 text-[26px] font-extrabold leading-snug text-ink lg:text-[34px]">همه‌ی کلیپ‌های آموزشی</h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-7 text-muted-foreground">هر درس شامل ویدیو، دیالوگ انگلیسی هماهنگ با پخش، ترجمه فارسی و اصطلاحات شماره‌گذاری‌شده است. ویدیوهای اضافه‌شده از پنل مدیریت نیز دقیقاً با همین ساختار نمایش داده می‌شوند.</p>
        {isActive ? <span className="mt-3 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white">اشتراک فعال — کلیپ‌های ویژه باز هستند</span> : <Link to="/subscribe" className="mt-3 inline-flex rounded-full bg-ink px-5 py-2 text-[12px] font-bold text-cream">فعال‌سازی اشتراک — {SITE.price}</Link>}
      </Reveal>
      {isLoading && <p className="py-8 text-center text-sm text-ink/60">در حال بارگذاری…</p>}

      {hasDbVideos && <>
        <div className="mt-2 flex items-center gap-2"><div className="h-px flex-1 bg-line" /><span className="rounded-full border border-ink/20 px-3 py-1 text-[11px] font-bold text-ink/70">ویدیوهای اضافه‌شده</span><div className="h-px flex-1 bg-line" /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          {videos!.map((v) => {
            const locked = v.access_type === "premium" && !isActive;
            return <Reveal key={v.id} className="rounded-[28px] border-2 border-line bg-blush p-4 sm:p-6">
              {locked ? <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream"><div className="relative flex aspect-video w-full items-center justify-center bg-ink"><div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-cream"><div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cream/30 bg-cream/10"><Lock size={26} /></div><span className="rounded-full bg-cream/10 px-3 py-1 text-[11px] font-bold">Premium</span><p className="text-sm font-bold">این کلیپ فقط برای اعضای فعال است</p></div></div><div className="p-5"><h3 className="text-lg font-extrabold text-ink">{v.title}</h3><p className="mt-2 text-[13px] leading-6 text-muted-foreground">برای مشاهده و پخش این درس، اشتراک فعال داشته باشید.</p><Link to="/subscribe" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"><Lock size={15} /> باز کردن با اشتراک</Link></div></div> : <LessonClip videoUrl="" poster={v.thumbnail ?? undefined} badge={v.badge} title={v.title} dialogues={v.dialogues} vocab={v.vocab} />}
            </Reveal>;
          })}
        </div>
      </>}

      <div className="mt-2 flex items-center gap-2"><div className="h-px flex-1 bg-line" /><span className="rounded-full border border-ink/20 px-3 py-1 text-[11px] font-bold text-ink/70">کلیپ‌های اصلی ۱ تا ۱۴</span><div className="h-px flex-1 bg-line" /></div>
      <div className="grid gap-4 lg:grid-cols-2">{LESSONS.map((l, i) => {
        const locked = i >= 2 && !isActive;
        return <Reveal key={l.id} delay={i * 40} className="rounded-[28px] border-2 border-line bg-blush p-4 sm:p-6">
          {locked ? <div className="overflow-hidden rounded-3xl border-2 border-line bg-cream"><div className="relative flex aspect-video w-full items-center justify-center bg-ink"><div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-cream"><div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cream/30 bg-cream/10"><Lock size={26} /></div><span className="rounded-full bg-cream/10 px-3 py-1 text-[11px] font-bold">Premium</span><p className="text-sm font-bold">این کلیپ فقط برای اعضای فعال است</p></div></div><div className="p-5"><span className="rounded-full border border-ink/30 px-2.5 py-1 text-[11px] text-ink">{l.badge}</span><h3 className="mt-3 text-lg font-extrabold text-ink">{l.title}</h3><p className="mt-2 text-[13px] leading-6 text-muted-foreground">برای مشاهده و پخش این درس، اشتراک فعال داشته باشید.</p><Link to="/subscribe" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"><Lock size={15} /> باز کردن با اشتراک</Link></div></div> : <LessonClip videoUrl={l.videoUrl} badge={l.badge} title={l.title} dialogues={l.dialogues} vocab={l.vocab} />}
        </Reveal>;
      })}</div>
      <Reveal className="rounded-[28px] border-2 border-line bg-blush p-6 text-center lg:p-10"><h2 className="text-lg font-extrabold text-ink">هر روز یک الی دو درس تازه در اکانت شما</h2><Link to="/auth" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream"><ArrowLeft size={16} /> شروع اشتراک — {SITE.price}</Link></Reveal>
    </main>
  </div>;
}
