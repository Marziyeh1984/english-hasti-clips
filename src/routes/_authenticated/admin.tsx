import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount } from "@/lib/account.functions";
import {
  listPaymentRequests,
  approvePayment,
  rejectPayment,
  adminListVideos,
  adminCreateVideo,
  adminDeleteVideo,
  adminCreateUploadUrl,
} from "@/lib/admin.functions";
import { PageShell, Card, Field, PrimaryButton, StatusPill, BackToHome } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت — English Hasti" },
      { name: "description", content: "بررسی رسیدهای پرداخت، فعال‌سازی اشتراک و مدیریت ویدیوها." },
      { property: "og:title", content: "پنل مدیریت — English Hasti" },
      { property: "og:description", content: "بررسی پرداخت‌ها و مدیریت ویدیوهای English Hasti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const fa = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }) : "—";

function AdminPage() {
  const qc = useQueryClient();
  const fetchAccount = useServerFn(getMyAccount);
  const fetchPayments = useServerFn(listPaymentRequests);
  const approve = useServerFn(approvePayment);
  const reject = useServerFn(rejectPayment);
  const fetchVideos = useServerFn(adminListVideos);
  const createVideo = useServerFn(adminCreateVideo);
  const removeVideo = useServerFn(adminDeleteVideo);
  const makeUploadUrl = useServerFn(adminCreateUploadUrl);

  const account = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });
  const isAdmin = account.data?.isAdmin === true;

  const payments = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => fetchPayments({}),
    enabled: isAdmin,
  });
  const videos = useQuery({
    queryKey: ["admin-videos"],
    queryFn: () => fetchVideos({}),
    enabled: isAdmin,
  });

  const [days, setDays] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    accessType: "premium" as "free" | "premium",
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<"video" | "thumbnail" | null>(null);

  async function uploadFile(kind: "video" | "thumbnail", file: File) {
    setError("");
    setUploading(kind);
    try {
      const ticket = await makeUploadUrl({ data: { kind, fileName: file.name } });
      const { error: upErr } = await supabase.storage
        .from(ticket.bucket)
        .uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type || undefined,
        });
      if (upErr) throw new Error("آپلود فایل ممکن نشد.");
      setForm((f) =>
        kind === "video" ? { ...f, videoUrl: ticket.path } : { ...f, thumbnail: ticket.path },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود فایل ممکن نشد.");
    } finally {
      setUploading(null);
    }
  }

  const approveM = useMutation({
    mutationFn: (v: { paymentId: string; days: number }) => approve({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "خطا در تأیید."),
  });
  const rejectM = useMutation({
    mutationFn: (paymentId: string) => reject({ data: { paymentId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-payments"] }),
  });
  const createM = useMutation({
    mutationFn: () =>
      createVideo({
        data: {
          title: form.title,
          description: form.description,
          thumbnail: form.thumbnail,
          videoUrl: form.videoUrl,
          accessType: form.accessType,
        },
      }),
    onSuccess: () => {
      setForm({ title: "", description: "", thumbnail: "", videoUrl: "", accessType: "premium" });
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "ثبت ویدیو ممکن نشد."),
  });
  const deleteM = useMutation({
    mutationFn: (videoId: string) => removeVideo({ data: { videoId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-videos"] }),
  });

  if (account.isLoading) {
    return (
      <PageShell>
        <p className="text-sm text-ink/60">در حال بارگذاری…</p>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <Card className="mx-auto max-w-md text-center">
          <h1 className="font-script text-4xl text-ink">دسترسی نداری</h1>
          <p className="mt-3 text-sm text-ink/70">این بخش فقط برای مدیر سایت است.</p>
          <Link
            to="/dashboard"
            className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream"
          >
            بازگشت به داشبورد
          </Link>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <BackToHome className="mb-4" />
      <h1 className="font-script text-5xl text-ink">پنل مدیریت</h1>

      {error && <p className="mt-3 text-[13px] font-semibold text-red-700">{error}</p>}

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-ink">درخواست‌های پرداخت</h2>
        {payments.isLoading && <p className="mt-3 text-[13px] text-ink/60">در حال بارگذاری…</p>}
        {payments.data?.length === 0 && (
          <p className="mt-3 text-[13px] text-ink/60">درخواستی ثبت نشده است.</p>
        )}
        <div className="mt-4 flex flex-col gap-4">
          {payments.data?.map((p) => (
            <div key={p.id} className="rounded-2xl border-2 border-line/50 bg-cream/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-ink">{p.name || "بدون نام"}</p>
                  <p dir="ltr" className="text-[12px] text-ink/60">
                    {p.email}
                  </p>
                </div>
                <StatusPill
                  tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}
                >
                  {p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}
                </StatusPill>
              </div>

              <dl className="mt-3 grid gap-1.5 text-[13px] text-ink/80 sm:grid-cols-3">
                <div className="flex justify-between sm:block">
                  <dt className="text-ink/60">مبلغ</dt>
                  <dd className="font-semibold">{p.amount.toLocaleString("fa-IR")} تومان</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-ink/60">تاریخ پرداخت</dt>
                  <dd>{fa(p.payment_date)}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-ink/60">ثبت در سایت</dt>
                  <dd>{fa(p.created_at)}</dd>
                </div>
              </dl>

              {p.note && <p className="mt-2 text-[13px] text-ink/70">یادداشت: {p.note}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {p.receiptUrl && (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border-2 border-line px-4 py-2 text-[12px] font-bold text-ink transition-all hover:bg-blush active:scale-95"
                  >
                    دیدن رسید
                  </a>
                )}
                {p.status === "pending" && (
                  <>
                    <input
                      type="number"
                      min={1}
                      max={3650}
                      value={days[p.id] ?? "30"}
                      onChange={(e) => setDays((d) => ({ ...d, [p.id]: e.target.value }))}
                      className="w-24 rounded-full border-2 border-line bg-cream px-3 py-2 text-center text-[13px] text-ink outline-none"
                      aria-label="مدت اشتراک به روز"
                    />
                    <span className="text-[12px] text-ink/60">روز</span>
                    <PrimaryButton
                      onClick={() => {
                        setError("");
                        approveM.mutate({ paymentId: p.id, days: Number(days[p.id] ?? 30) });
                      }}
                      disabled={approveM.isPending}
                    >
                      تأیید و فعال‌سازی
                    </PrimaryButton>
                    <button
                      onClick={() => rejectM.mutate(p.id)}
                      disabled={rejectM.isPending}
                      className="rounded-full border-2 border-red-300 px-4 py-2 text-[12px] font-bold text-red-700 transition-all hover:bg-red-50 active:scale-95"
                    >
                      رد کردن
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-ink">افزودن ویدیو</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Field
            label="عنوان"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Field
            label="آدرس فایل ویدیو (مسیر فایل خصوصی یا لینک)"
            value={form.videoUrl}
            dir="ltr"
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          />
          <Field
            label="توضیح"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Field
            label="کاور (اختیاری)"
            value={form.thumbnail}
            dir="ltr"
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          />
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-cream px-4 py-3 text-[13px] font-semibold text-ink transition-all hover:bg-blush-deep/30">
            <Upload size={16} />
            {uploading === "video" ? "در حال آپلود ویدیو…" : "آپلود فایل ویدیو از دستگاه"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploading !== null}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile("video", f);
                e.target.value = "";
              }}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-line bg-cream px-4 py-3 text-[13px] font-semibold text-ink transition-all hover:bg-blush-deep/30">
            <Upload size={16} />
            {uploading === "thumbnail" ? "در حال آپلود کاور…" : "آپلود کاور از دستگاه"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading !== null}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile("thumbnail", f);
                e.target.value = "";
              }}
            />
          </label>
          <label className="block text-right">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">نوع دسترسی</span>
            <select
              value={form.accessType}
              onChange={(e) =>
                setForm({ ...form, accessType: e.target.value === "free" ? "free" : "premium" })
              }
              className="w-full rounded-full border-2 border-line bg-cream px-4 py-2.5 text-sm text-ink outline-none"
            >
              <option value="premium">ویژه (فقط اعضای دارای اشتراک)</option>
              <option value="free">رایگان</option>
            </select>
          </label>
        </div>
        <PrimaryButton
          className="mt-4"
          onClick={() => {
            setError("");
            createM.mutate();
          }}
          disabled={createM.isPending || !form.title.trim() || !form.videoUrl.trim()}
        >
          {createM.isPending ? "در حال ثبت…" : "ثبت ویدیو"}
        </PrimaryButton>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-ink">ویدیوها</h2>
        {videos.data?.length === 0 && <p className="mt-3 text-[13px] text-ink/60">ویدیویی ثبت نشده.</p>}
        <ul className="mt-3 divide-y divide-line/30">
          {videos.data?.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="text-sm font-semibold text-ink">{v.title}</span>
              <div className="flex items-center gap-2">
                <StatusPill tone={v.access_type === "free" ? "muted" : "ok"}>
                  {v.access_type === "free" ? "رایگان" : "ویژه"}
                </StatusPill>
                <button
                  onClick={() => deleteM.mutate(v.id)}
                  disabled={deleteM.isPending}
                  aria-label="حذف ویدیو"
                  className="rounded-full border-2 border-red-300 p-2 text-red-700 transition-all hover:bg-red-50 active:scale-90"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}
