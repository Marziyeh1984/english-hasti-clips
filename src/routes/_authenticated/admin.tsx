import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Upload, User, X, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount } from "@/lib/account.functions";
import { listPaymentRequests, approvePayment, rejectPayment, adminListVideos, adminCreateVideo, adminDeleteVideo, adminCreateUploadUrl, adminSetVideoAccess, adminListUsers, adminGetUserDetails, adminUpdateVideo } from "@/lib/admin.functions";
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

function loadVideoForEdit(video: any) {
  setForm({
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail || "",
    videoUrl: video.video_url,
    accessType: video.access_type,
    badge: video.badge
  });
  setDialogues(video.dialogues?.map((d: any) => ({ en: d.en, fa: d.fa, t: String(d.t) })) || [emptyDialogue()]);
  setVocab(video.vocab || [emptyVocab()]);
}

function parseTranscript(text: string): Dialogue[] {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const dialogues: Dialogue[] = [];
  
  for (const line of lines) {
    // Pattern: time | English -> Persian
    // Example: 0.0 | Something happened -> 今天发生了什么
    const match = line.match(/^(\d+(?:\.\d+)?)\s*\|\s*(.+?)\s*->\s*(.+)$/);
    if (match) {
      const timeStr = match[1];
      const english = match[2].trim();
      const persian = match[3].trim();
      
      // Convert time to seconds (handle both decimal and MM:SS format)
      let time = 0;
      if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          time = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
        }
      } else {
        time = parseFloat(timeStr);
      }
      
      if (english && persian && !isNaN(time)) {
        dialogues.push({ en: english, fa: persian, t: String(time) });
      }
    }
  }
  
  return dialogues;
}

function AdminPage() {
  const qc = useQueryClient();
  const fetchAccount = useServerFn(getMyAccount);
  const fetchPayments = useServerFn(listPaymentRequests);
  const approve = useServerFn(approvePayment);
  const reject = useServerFn(rejectPayment);
  const fetchVideos = useServerFn(adminListVideos);
  const createVideo = useServerFn(adminCreateVideo);
  const removeVideo = useServerFn(adminDeleteVideo);
  const updateVideo = useServerFn(adminUpdateVideo);
  const setVideoAccess = useServerFn(adminSetVideoAccess);
  const makeUploadUrl = useServerFn(adminCreateUploadUrl);
  const fetchUsers = useServerFn(adminListUsers);
  const fetchUserDetails = useServerFn(adminGetUserDetails);
  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });
  const [signedInEmail, setSignedInEmail] = useState("");
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedInEmail(data.user?.email?.trim().toLowerCase() ?? "")); }, []);
  const isAdmin = account.data?.isAdmin === true || signedInEmail === CONFIGURED_ADMIN_EMAIL;
  const payments = useQuery({ queryKey: ["admin-payments"], queryFn: () => fetchPayments({}), enabled: isAdmin });
  const videos = useQuery({ queryKey: ["admin-videos"], queryFn: () => fetchVideos({}), enabled: isAdmin });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => fetchUsers({}), enabled: isAdmin, retry: false });
  const nonAdminUsers = users.data?.filter(u => u.email.toLowerCase() !== CONFIGURED_ADMIN_EMAIL) || [];
  const [days, setDays] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "free" as "free" | "premium", badge: "درس جدید" });
  const [dialogues, setDialogues] = useState<Dialogue[]>([emptyDialogue()]);
  const [vocab, setVocab] = useState<Vocab[]>([emptyVocab()]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<"video" | "thumbnail" | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [parsedDialogues, setParsedDialogues] = useState<Dialogue[]>([]);
  const userDetails = useQuery({ queryKey: ["admin-user-details", selectedUserId], queryFn: () => fetchUserDetails({ data: { userId: selectedUserId! } }), enabled: !!selectedUserId && isAdmin });

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
  const updateM = useMutation({
    mutationFn: () => updateVideo({ data: { ...form, dialogues, vocab, videoId: editingVideoId! } }),
    onSuccess: () => {
      setForm({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "free", badge: "درس جدید" });
      setDialogues([emptyDialogue()]); setVocab([emptyVocab()]); setError(""); setEditingVideoId(null); qc.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "ویرایش ویدیو ممکن نشد."),
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
      <h2 className="text-lg font-bold text-ink">اشتراک‌های فعال کاربران</h2>
      {users.isLoading && <p className="mt-3 text-[13px] text-ink/60">در حال بارگذاری…</p>}
      {!users.isLoading && nonAdminUsers.filter(u => u.isActive).length === 0 && <p className="mt-3 text-[13px] text-ink/60">کاربری با اشتراک فعال ندارد. هنوز کاربری ثبت‌نام نکرده است.</p>}
      <div className="mt-4 space-y-3">{nonAdminUsers.filter(u => u.isActive).map((u) => <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">{u.name || "بدون نام"}</p>
          <p dir="ltr" className="text-[12px] text-ink/60">{u.email}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-ink/70">
            <span>شروع: {faDate(u.subscription?.start_date)}</span>
            <span>•</span>
            <span>پایان: {faDate(u.subscription?.end_date)}</span>
          </div>
        </div>
        <button onClick={() => setSelectedUserId(u.id)} className="flex items-center gap-1.5 rounded-full border-2 border-emerald-300 bg-emerald-100 px-3 py-2 text-[12px] font-bold text-emerald-800 transition-all hover:bg-emerald-200"><User size={14} /> جزئیات</button>
      </div>)}</div>
    </Card>

    <Card className="mt-6">
      <h2 className="text-lg font-bold text-ink">همه کاربران</h2>
      {users.isLoading && <p className="mt-3 text-[13px] text-ink/60">در حال بارگذاری…</p>}
      {!users.isLoading && nonAdminUsers.length === 0 && <p className="mt-3 text-[13px] text-ink/60">کاربری ثبت نشده است. هنوز کاربری ثبت‌نام نکرده است.</p>}
      <div className="mt-4 space-y-3">{nonAdminUsers.map((u) => <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-line/50 bg-cream/60 p-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">{u.name || "بدون نام"}</p>
          <p dir="ltr" className="text-[12px] text-ink/60">{u.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <StatusPill tone={u.isActive ? "ok" : u.subscription?.status === "pending" ? "warn" : "muted"}>{u.isActive ? "اشتراک فعال" : u.subscription?.status === "pending" ? "در انتظار" : "بدون اشتراک"}</StatusPill>
            {u.subscription?.end_date && <span className="text-[11px] text-ink/60">انقضا: {faDate(u.subscription.end_date)}</span>}
          </div>
        </div>
        <button onClick={() => setSelectedUserId(u.id)} className="flex items-center gap-1.5 rounded-full border-2 border-line bg-blush px-3 py-2 text-[12px] font-bold text-ink transition-all hover:bg-blush-deep"><User size={14} /> جزئیات</button>
      </div>)}</div>
    </Card>

    {selectedUserId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">جزئیات کاربر</h2>
            <button onClick={() => setSelectedUserId(null)} className="rounded-full p-2 text-ink/60 hover:bg-blush"><X size={20} /></button>
          </div>
          {userDetails.isLoading && <p className="mt-4 text-sm text-ink/60">در حال بارگذاری…</p>}
          {userDetails.data && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-ink">اطلاعات شخصی</h3>
                <div className="mt-2 space-y-1 text-[13px] text-ink/70">
                  <p>نام: {userDetails.data.profile.name || "بدون نام"}</p>
                  <p dir="ltr">ایمیل: {userDetails.data.profile.email}</p>
                  <p>تاریخ ثبت‌نام: {faDate(userDetails.data.profile.created_at)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">وضعیت اشتراک</h3>
                {userDetails.data.subscription ? (
                  <div className="mt-2 space-y-1 text-[13px] text-ink/70">
                    <p>وضعیت: <StatusPill tone={userDetails.data.isActive ? "ok" : userDetails.data.subscription.status === "pending" ? "warn" : "muted"}>{userDetails.data.isActive ? "فعال" : userDetails.data.subscription.status === "pending" ? "در انتظار" : "منقضی"}</StatusPill></p>
                    <p>شروع: {faDate(userDetails.data.subscription.start_date)}</p>
                    <p>پایان: {faDate(userDetails.data.subscription.end_date)}</p>
                    {userDetails.data.subscription.payment_verified_at && <p>تاریخ تأیید پرداخت: {faDate(userDetails.data.subscription.payment_verified_at)}</p>}
                  </div>
                ) : (
                  <p className="mt-2 text-[13px] text-ink/60">اشتراکی ندارد</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">تاریخچه پرداخت</h3>
                {userDetails.data.payments.length === 0 ? (
                  <p className="mt-2 text-[13px] text-ink/60">پرداختی ثبت نشده است</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {userDetails.data.payments.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line/40 bg-cream/50 p-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">{p.amount.toLocaleString("fa-IR")} تومان</p>
                          <p className="text-[11px] text-ink/60">{faDate(p.payment_date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}>{p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}</StatusPill>
                          {p.receiptUrl && <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-line bg-blush px-2 py-1 text-[11px] font-bold text-ink transition-all hover:bg-blush-deep">رسید</a>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    )}

    <Card className="mt-6">
      <h2 className="text-lg font-bold text-ink">{editingVideoId ? "ویرایش ویدیو آموزشی" : "افزودن ویدیو آموزشی"}</h2>
      {editingVideoId && <button onClick={() => { setEditingVideoId(null); setForm({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "free", badge: "درس جدید" }); setDialogues([emptyDialogue()]); setVocab([emptyVocab()]); }} className="mb-3 text-[12px] text-ink/60 hover:text-ink">لغو ویرایش</button>}
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
        <div className="flex items-center justify-between gap-2"><div><h3 className="font-bold text-ink">دیالوگ‌ها و ترجمه</h3><p className="text-[11px] text-ink/60">زمان را به‌صورت ثانیه (مثل 12.5) یا mm:ss.xx (مثل 01:12.50) وارد کن.</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setDialogues((d) => [...d, emptyDialogue()])} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-[11px] font-bold text-cream"><Plus size={14} /> افزودن خط</button><button type="button" onClick={() => setShowTranscriptModal(true)} className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-blush px-3 py-2 text-[11px] font-bold text-ink transition-all hover:bg-blush-deep">📋 پیست متن کامل</button></div>
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
      <PrimaryButton className="mt-5" onClick={() => { setError(""); editingVideoId ? updateM.mutate() : createM.mutate(); }} disabled={createM.isPending || updateM.isPending || !form.title.trim() || !form.videoUrl.trim()}> {createM.isPending || updateM.isPending ? "در حال ذخیره…" : editingVideoId ? "ذخیره تغییرات" : "ثبت ویدیو و محتوای آموزشی"}</PrimaryButton>
    </Card>

    {showTranscriptModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">پیست متن کامل</h2>
            <button onClick={() => { setShowTranscriptModal(false); setTranscriptText(""); setParsedDialogues([]); }} className="rounded-full p-2 text-ink/60 hover:bg-blush"><X size={20} /></button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink">الگوی فرمت:</h3>
              <p className="mt-1 text-[11px] text-ink/70">زمان | متن انگلیسی -> متن فارسی</p>
              <p className="text-[11px] text-ink/60">مثال: 0.0 | Something happened -> امروز发生了什么</p>
            </div>
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="متن کامل را اینجا پیست کنید..."
              className="w-full h-64 rounded-xl border-2 border-line bg-cream p-4 text-sm text-ink font-mono"
              dir="ltr"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const parsed = parseTranscript(transcriptText);
                  if (parsed.length === 0) {
                    setError("هیچ خطی شناسایی نشد. فرمت صحیح نیست.");
                  } else {
                    setParsedDialogues(parsed);
                    setError("");
                  }
                }}
                className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream transition-all hover:scale-105"
              >
                بررسی و استخراج
              </button>
              {parsedDialogues.length > 0 && (
                <button
                  onClick={() => {
                    setDialogues(parsedDialogues);
                    setShowTranscriptModal(false);
                    setTranscriptText("");
                    setParsedDialogues([]);
                  }}
                  className="rounded-full border-2 border-line bg-blush px-4 py-2 text-sm font-bold text-ink transition-all hover:bg-blush-deep"
                >
                  اعمال {parsedDialogues.length} خط
                </button>
              )}
            </div>
            {parsedDialogues.length > 0 && (
              <div className="rounded-xl border border-line/40 bg-cream/50 p-3">
                <h4 className="text-sm font-bold text-ink mb-2">پیش‌نمایش استخراج شده ({parsedDialogues.length} خط):</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {parsedDialogues.map((d, i) => (
                    <div key={i} className="text-xs text-ink/70 font-mono">
                      {d.t} | {d.en.substring(0, 30)}{d.en.length > 30 ? '...' : ''} -> {d.fa.substring(0, 30)}{d.fa.length > 30 ? '...' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    )}

    <Card className="mt-6"><h2 className="text-lg font-bold text-ink">ویدیوها</h2><ul className="mt-3 divide-y divide-line/30">{videos.data?.map((v) => <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="text-sm font-semibold text-ink">{v.title}</p><p className="text-[11px] text-ink/60">{v.dialogues?.length ?? 0} دیالوگ · {v.vocab?.length ?? 0} اصطلاح</p></div><div className="flex items-center gap-2"><select value={v.access_type} onChange={(e) => accessM.mutate({ videoId: v.id, accessType: e.target.value === "free" ? "free" : "premium" })} disabled={accessM.isPending} className="rounded-full border-2 border-line bg-cream px-3 py-2 text-[12px] font-bold text-ink"><option value="premium">🔒 ویژه (اشتراک)</option><option value="free">🔓 رایگان</option></select><button onClick={() => { setEditingVideoId(v.id); loadVideoForEdit(v); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={editingVideoId !== null} className="rounded-full border-2 border-line bg-blush px-3 py-2 text-[12px] font-bold text-ink transition-all hover:bg-blush-deep"><Edit size={15} /></button><button onClick={() => deleteM.mutate(v.id)} disabled={deleteM.isPending} className="rounded-full border-2 border-red-300 p-2 text-red-700"><Trash2 size={15} /></button></div></li>)}</ul></Card>
  </PageShell>;
}
