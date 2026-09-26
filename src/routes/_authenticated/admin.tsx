import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount } from "@/lib/account.functions";
import { listPaymentRequests, approvePayment, rejectPayment, adminListVideos, adminCreateVideo, adminDeleteVideo, adminCreateUploadUrl, adminSetVideoAccess } from "@/lib/admin.functions";
import { PageShell, Card, Field, PrimaryButton, StatusPill, BackToHome } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "پنل مدیریت — English Hasti" }, { name: "description", content: "مدیریت پرداخت‌ها و ویدیوهای English Hasti." }] }),
  component: AdminPage,
});

const CONFIGURED_ADMIN_EMAIL = "lak20ml@gmail.com";
type Dialogue = { en: string; fa: string; t: string };
type Vocab = { en: string; fa: string };
const emptyDialogue = (): Dialogue => ({ en: "", fa: "", t: "0" });
const emptyVocab = (): Vocab => ({ en: "", fa: "" });
const faDate = (d: string | null) => d ? new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }) : "—";

function AdminPage() {
  const qc = useQueryClient();
  const fetchAccount = useServerFn(getMyAccount);
  const fetchPayments = useServerFn(listPaymentRequests);
  const approve = useServerFn(approvePayment);
  const reject = useServerFn(rejectPayment);
  const fetchVideos = useServerFn(adminListVideos);
  const createVideo = useServerFn(adminCreateVideo);
  const removeVideo = useServerFn(adminDeleteVideo);
  const setVideoAccess = useServerFn(adminSetVideoAccess);
  const makeUploadUrl = useServerFn(adminCreateUploadUrl);
  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });
  const [signedInEmail, setSignedInEmail] = useState("");
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedInEmail(data.user?.email?.trim().toLowerCase() ?? "")); }, []);
  const isAdmin = account.data?.isAdmin === true || signedInEmail === CONFIGURED_ADMIN_EMAIL;
  const payments = useQuery({ queryKey: ["admin-payments"], queryFn: () => fetchPayments({}), enabled: isAdmin });
  const videos = useQuery({ queryKey: ["admin-videos"], queryFn: () => fetchVideos({}), enabled: isAdmin });
  const [days, setDays] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "free" as "free" | "premium", badge: "درس جدید" });
  const [dialogues, setDialogues] = useState<Dialogue[]>([emptyDialogue()]);
  const [vocab, setVocab] = useState<Vocab[]>([emptyVocab()]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<"video" | "thumbnail" | null>(null);

  async function uploadFile(kind: "video" | "thumbnail", file: File) {
    setError(""); setUploading(kind);
    try {
      const ticket = await makeUploadUrl({ data: { kind, fileName: file.name } });
      const { error: upErr } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type || undefined });
      if (upErr) throw new Error("آپلود فایل ممکن نشد.");
      setForm((f) => kind === "video" ? { ...f, videoUrl: ticket.path } : { ...f, thumbnail: ticket.path });
    } catch (e) { setError(e instanceof Error ? e.message : "آپلود فایل ممکن نشد."); }
    finally { setUploading(null); }
  }

  const approveM = useMutation({ mutationFn: (v: { paymentId: string; days: number }) => approve({ data: v }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-payments"] }), onError: (e: unknown) => setError(e instanceof Error ? e.message : "خطا در تأیید.") });
  const rejectM = useMutation({ mutationFn: (paymentId: string) => reject({ data: { paymentId } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-payments"] }) });
  const accessM = useMutation({ mutationFn: (v: { videoId: string; accessType: "free" | "premium" }) => setVideoAccess({ data: v }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-videos"] }), onError: (e: unknown) => setError(e instanceof Error ? e.message : "تغییر دسترسی ویدیو ممکن نشد.") });
  const createM = useMutation({
    mutationFn: () => createVideo({ data: { ...form, dialogues, vocab } }),
    onSuccess: () => {
      setForm({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "free", badge: "درس جدید" });
      setDialogues([emptyDialogue()]); setVocab([emptyVocab()]); setError(""); qc.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "ثبت ویدیو ممکن نشد."),
  });
  const deleteM = useMutation({ mutationFn: (videoId: string) => removeVideo({ data: { videoId } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-videos"] }) });

  if (account.isLoading && !signedInEmail) return <PageShell><p className="text-sm text-ink/60">در حال بارگذاری…</p></PageShell>;
  if (!isAdmin) return <PageShell><Card className="mx-auto max-w-md text-center"><h1 className="font-script text-4xl text-ink">دسترسی نداری</h1><p className="mt-3 text-sm text-ink/70">این بخش فقط برای مدیر سایت است.</p><Link to="/dashboard" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream">بازگشت به داشبورد</Link></Card></PageShell>;

  return <PageShell>
    <BackToHome className="mb-4" /><h1 className="font-script text-5xl text-ink">پنل مدیریت</h1>
    {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">{error}</p>}

    <Card className="mt-6">
      <h2 className="text-lg font-bold text-ink">درخواست‌های پرداخت</h2>
      {payments.data?.length === 0 && <p className="mt-3 text-[13px] text-ink/60">درخواستی ثبت نشده است.</p>}
      <div className="mt-4 flex flex-col gap-4">{payments.data?.map((p) => <div key={p.id} className="rounded-2xl border-2 border-line/50 bg-cream/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-bold text-ink">{p.name || "بدون نام"}</p><p dir="ltr" className="text-[12px] text-ink/60">{p.email}</p></div><StatusPill tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}>{p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}</StatusPill></div>
        <p className="mt-2 text-[13px] text-ink/70">{p.amount.toLocaleString("fa-IR")} تومان · {faDate(p.payment_date)}</p>
        {p.note && <p className="mt-2 text-[13px] text-ink/70">یادداشت: {p.note}</p>}
        {p.receiptUrl && <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-blush px-3 py-1.5 text-[12px] font-bold text-ink transition-all hover:bg-blush-deep"><Upload size={14} /> مشاهده رسید</a>}
        {p.status === "pending" && <div className="mt-3 flex flex-wrap items-center gap-2"><input type="number" min={1} max={3650} value={days[p.id] ?? "30"} onChange={(e) => setDays((d) => ({ ...d, [p.id]: e.target.value }))} className="w-24 rounded-full border-2 border-line bg-cream px-3 py-2 text-center text-[13px] text-ink" /><span className="text-[12px] text-ink/60">روز</span><PrimaryButton onClick={() => approveM.mutate({ paymentId: p.id, days: Number(days[p.id] ?? 30) })} disabled={approveM.isPending}>تأیید و فعال‌سازی</PrimaryButton><button onClick={() => rejectM.mutate(p.id)} className="rounded-full border-2 border-red-300 px-4 py-2 text-[12px] font-bold text-red-700">رد کردن</button></div>}
      </div>)}</div>
    </Card>

    <Card className="mt-6">
      <h2 className="text-lg font-bold text-ink">افزودن ویدیو آموزشی</h2>
      <p className="mt-1 text-[12px] leading-6 text-muted-foreground">ویدیوهای جدید دقیقاً با ساختار درس‌های فعلی ذخیره می‌شوند: دیالوگ زمان‌بندی‌شده، ترجمه فارسی و اصطلاحات.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Field label="عنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Field label="برچسب درس" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
        <Field label="توضیح" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Field label="مسیر فایل ویدیو" value={form.videoUrl} dir="ltr" onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <Field label="مسیر کاور (اختیاری)" value={form.thumbnail} dir="ltr" onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-cream px-4 py-3 text-[13px] font-semibold text-ink"><Upload size={16} />{uploading === "video" ? "در حال آپلود…" : "آپلود فایل ویدیو"}<input type="file" accept="video/*" className="hidden" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadFile("video", f); e.target.value = ""; }} /></label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-cream px-4 py-3 text-[13px] font-semibold text-ink"><Upload size={16} />{uploading === "thumbnail" ? "در حال آپلود…" : "آپلود کاور"}<input type="file" accept="image/*" className="hidden" disabled={uploading !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadFile("thumbnail", f); e.target.value = ""; }} /></label>
        <label className="block"><span className="mb-1.5 block text-[13px] font-semibold text-ink">نوع دسترسی</span><select value={form.accessType} onChange={(e) => setForm({ ...form, accessType: e.target.value === "free" ? "free" : "premium" })} className="w-full rounded-full border-2 border-line bg-cream px-4 py-2.5 text-sm text-ink"><option value="premium">ویژه (اشتراک)</option><option value="free">رایگان</option></select></label>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-line/60 bg-cream/50 p-4">
        <div className="flex items-center justify-between gap-2"><div><h3 className="font-bold text-ink">دیالوگ‌ها و ترجمه</h3><p className="text-[11px] text-ink/60">زمان را به‌صورت ثانیه (مثل 12.5) یا mm:ss.xx (مثل 01:12.50) وارد کن.</p></div><button type="button" onClick={() => setDialogues((d) => [...d, emptyDialogue()])} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-[11px] font-bold text-cream"><Plus size={14} /> افزودن خط</button></div>
        <div className="mt-3 flex flex-col gap-3">{dialogues.map((d, i) => <div key={i} className="grid gap-2 rounded-xl border border-line/40 bg-blush/50 p-3 lg:grid-cols-[130px_1fr_1fr_38px]">
          <input value={d.t} onChange={(e) => setDialogues((a) => a.map((x, j) => j === i ? { ...x, t: e.target.value } : x))} inputMode="decimal" placeholder="مثلاً 01:12.50" className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink" />
          <input value={d.en} dir="ltr" onChange={(e) => setDialogues((a) => a.map((x, j) => j === i ? { ...x, en: e.target.value } : x))} placeholder="English dialogue" className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink" />
          <input value={d.fa} onChange={(e) => setDialogues((a) => a.map((x, j) => j === i ? { ...x, fa: e.target.value } : x))} placeholder="ترجمه فارسی" className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink" />
          <button type="button" onClick={() => setDialogues((a) => a.length > 1 ? a.filter((_, j) => j !== i) : a)} className="flex items-center justify-center rounded-lg border border-red-300 text-red-700"><Trash2 size={15} /></button>
        </div>)}</div>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-line/60 bg-cream/50 p-4">
        <div className="flex items-center justify-between gap-2"><div><h3 className="font-bold text-ink">اصطلاحات درس</h3><p className="text-[11px] text-ink/60">دقیقاً همان ساختار Vocabulary درس‌های فعلی.</p></div><button type="button" onClick={() => setVocab((v) => [...v, emptyVocab()])} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-[11px] font-bold text-cream"><Plus size={14} /> افزودن اصطلاح</button></div>
        <div className="mt-3 flex flex-col gap-2">{vocab.map((v, i) => <div key={i} className="grid gap-2 lg:grid-cols-[1fr_1fr_38px]"><input value={v.en} dir="ltr" onChange={(e) => setVocab((a) => a.map((x, j) => j === i ? { ...x, en: e.target.value } : x))} placeholder="English phrase" className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink" /><input value={v.fa} onChange={(e) => setVocab((a) => a.map((x, j) => j === i ? { ...x, fa: e.target.value } : x))} placeholder="معنی و توضیح فارسی" className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink" /><button type="button" onClick={() => setVocab((a) => a.length > 1 ? a.filter((_, j) => j !== i) : a)} className="flex items-center justify-center rounded-lg border border-red-300 text-red-700"><Trash2 size={15} /></button></div>)}</div>
      </div>
      <PrimaryButton className="mt-5" onClick={() => { setError(""); createM.mutate(); }} disabled={createM.isPending || !form.title.trim() || !form.videoUrl.trim()}> {createM.isPending ? "در حال ثبت…" : "ثبت ویدیو و محتوای آموزشی"}</PrimaryButton>
    </Card>

    <Card className="mt-6"><h2 className="text-lg font-bold text-ink">ویدیوها</h2><ul className="mt-3 divide-y divide-line/30">{videos.data?.map((v) => <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="text-sm font-semibold text-ink">{v.title}</p><p className="text-[11px] text-ink/60">{v.dialogues?.length ?? 0} دیالوگ · {v.vocab?.length ?? 0} اصطلاح</p></div><div className="flex items-center gap-2"><select value={v.access_type} onChange={(e) => accessM.mutate({ videoId: v.id, accessType: e.target.value === "free" ? "free" : "premium" })} disabled={accessM.isPending} className="rounded-full border-2 border-line bg-cream px-3 py-2 text-[12px] font-bold text-ink"><option value="premium">🔒 ویژه (اشتراک)</option><option value="free">🔓 رایگان</option></select><button onClick={() => deleteM.mutate(v.id)} disabled={deleteM.isPending} className="rounded-full border-2 border-red-300 p-2 text-red-700"><Trash2 size={15} /></button></div></li>)}</ul></Card>
  </PageShell>;
}
