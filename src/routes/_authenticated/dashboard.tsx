import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, ShieldCheck, Users, DollarSign, Calendar, FileText, Eye, Search, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount, updateMyProfile } from "@/lib/account.functions";
import { listPublicVideos } from "@/lib/videos.functions";
import { listPaymentRequests, approvePayment, rejectPayment, adminListUsers, adminGetUserDetails } from "@/lib/admin.functions";
import { PageShell, Card, Field, PrimaryButton, StatusPill, BackToHome } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "داشبورد من — English Hasti" },
      { name: "description", content: "وضعیت اشتراک، اطلاعات حساب و تاریخچه پرداخت‌های شما." },
      { property: "og:title", content: "داشبورد من — English Hasti" },
      { property: "og:description", content: "وضعیت اشتراک و تاریخچه پرداخت‌های شما." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const CONFIGURED_ADMIN_EMAIL = "lak20ml@gmail.com";

const fa = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }) : "—";

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchAccount = useServerFn(getMyAccount);
  const saveProfile = useServerFn(updateMyProfile);
  const fetchVideos = useServerFn(listPublicVideos);
  const fetchPayments = useServerFn(listPaymentRequests);
  const approve = useServerFn(approvePayment);
  const reject = useServerFn(rejectPayment);
  const fetchUsers = useServerFn(adminListUsers);
  const fetchUserDetails = useServerFn(adminGetUserDetails);
  const [name, setName] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "users">("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [days, setDays] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });
  const { data: videos } = useQuery({ queryKey: ["videos", "public"], queryFn: () => fetchVideos() });
  const payments = useQuery({ queryKey: ["admin-payments"], queryFn: () => fetchPayments({}), enabled: isAdmin });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => fetchUsers({}), enabled: isAdmin });
  const userDetails = useQuery({
    queryKey: ["admin-user-details", selectedUserId],
    queryFn: () => fetchUserDetails({ data: { userId: selectedUserId! } }),
    enabled: !!selectedUserId && isAdmin,
  });

  // Error handling for queries
  if (payments.error) console.error("Payments query error:", payments.error);
  if (users.error) console.error("Users query error:", users.error);
  if (userDetails.error) console.error("User details query error:", userDetails.error);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: authData }) => {
      setSignedInEmail(authData.user?.email?.trim().toLowerCase() ?? "");
    });
  }, []);

  const save = useMutation({
    mutationFn: (n: string) => saveProfile({ data: { name: n } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["account"] }),
  });

  const approveM = useMutation({
    mutationFn: (v: { paymentId: string; days: number }) => approve({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      qc.invalidateQueries({ queryKey: ["account"] });
    },
    onError: (e: unknown) => console.error("خطا در تأیید:", e),
  });

  const rejectM = useMutation({
    mutationFn: (paymentId: string) => reject({ data: { paymentId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      qc.invalidateQueries({ queryKey: ["account"] });
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const sub = data?.subscription;
  const pendingPayment = data?.payments.some((p) => p.status === "pending");
  const isAdmin = data?.isAdmin === true || signedInEmail === CONFIGURED_ADMIN_EMAIL;

  const filteredUsers = users.data?.filter((user) =>
    (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ) || [];

  const stats = {
    totalUsers: users.data?.length || 0,
    activeSubscriptions: users.data?.filter((u) => u.isActive).length || 0,
    pendingPayments: payments.data?.filter((p) => p.status === "pending").length || 0,
    totalRevenue: users.data?.reduce((sum, u) => sum + (u.payments?.filter((p) => p.status === "approved").reduce((s, p) => s + p.amount, 0) || 0), 0) || 0,
  };

  return (
    <PageShell>
      <BackToHome className="mb-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-script text-5xl text-ink">داشبورد من</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-full border-2 border-line px-4 py-2 text-[13px] font-bold text-ink transition-all hover:bg-blush active:scale-95"
          >
            <LogOut size={15} /> خروج
          </button>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-sm text-ink/60">در حال بارگذاری…</p>}

      {data && (
        <>
          {/* Admin Tabs */}
          {isAdmin && (
            <div className="mt-6 flex flex-wrap gap-2 border-b border-line/50 pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                  activeTab === "overview"
                    ? "bg-ink text-cream"
                    : "border-2 border-line text-ink hover:bg-blush"
                }`}
              >
                <ShieldCheck size={15} /> نمای کلی
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                  activeTab === "payments"
                    ? "bg-ink text-cream"
                    : "border-2 border-line text-ink hover:bg-blush"
                }`}
              >
                <DollarSign size={15} /> درخواست‌های پرداخت
                {payments.data?.filter((p) => p.status === "pending").length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {payments.data.filter((p) => p.status === "pending").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                  activeTab === "users"
                    ? "bg-ink text-cream"
                    : "border-2 border-line text-ink hover:bg-blush"
                }`}
              >
                <Users size={15} /> کاربران
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* User Personal Section */}
            <Card>
              <h2 className="text-lg font-bold text-ink">وضعیت اشتراک</h2>
              <div className="mt-3">
                {data.isActive ? (
                  <StatusPill tone="ok">اشتراک فعال</StatusPill>
                ) : sub?.status === "pending" || pendingPayment ? (
                  <StatusPill tone="warn">در انتظار تأیید پرداخت</StatusPill>
                ) : sub?.status === "expired" ? (
                  <StatusPill tone="bad">اشتراک منقضی شده</StatusPill>
                ) : (
                  <StatusPill tone="muted">بدون اشتراک</StatusPill>
                )}
              </div>
              <dl className="mt-4 space-y-1.5 text-[13px] text-ink/80">
                <div className="flex justify-between">
                  <dt>شروع</dt>
                  <dd>{fa(sub?.start_date ?? null)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>پایان</dt>
                  <dd>{fa(sub?.end_date ?? null)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[13px] leading-6 text-ink/70">
                {data.isActive
                  ? "می‌توانی همه‌ی درس‌های ویژه را تماشا کنی."
                  : sub?.status === "pending" || pendingPayment
                    ? "رسید تو ثبت شده و منتظر بررسی است. معمولاً کمتر از ۲۴ ساعت طول می‌کشد."
                    : sub?.status === "expired"
                      ? "اشتراکت تمام شده. برای ادامه، تمدید کن."
                      : "برای دیدن درس‌های ویژه، اشتراک تهیه کن."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/subscribe"
                  className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream transition-all hover:scale-105 active:scale-95"
                >
                  {data.isActive ? "تمدید اشتراک" : "خرید اشتراک"}
                </Link>
                <Link
                  to="/lessons"
                  className="rounded-full border-2 border-line px-5 py-2.5 text-[13px] font-bold text-ink transition-all hover:bg-blush active:scale-95"
                >
                  کتابخانه ویدیوها
                </Link>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-ink">اطلاعات حساب</h2>
              <div className="mt-3 flex flex-col gap-3">
                <Field
                  label="نام"
                  value={name ?? data.profile.name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="text-right">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink">ایمیل</span>
                  <p dir="ltr" className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2.5 text-left text-sm text-ink/70">
                    {data.profile.email}
                  </p>
                </div>
                <PrimaryButton
                  onClick={() => save.mutate(name ?? data.profile.name)}
                  disabled={save.isPending}
                  className="self-start"
                >
                  {save.isPending ? "در حال ذخیره…" : "ذخیره نام"}
                </PrimaryButton>
                {save.isSuccess && <p className="text-[13px] text-emerald-800">ذخیره شد.</p>}
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="text-lg font-bold text-ink">تاریخچه پرداخت</h2>
              {data.payments.length === 0 ? (
                <p className="mt-3 text-[13px] text-ink/60">هنوز پرداختی ثبت نکرده‌ای.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line/30">
                  {data.payments.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <span className="text-sm font-semibold text-ink">
                        {p.amount.toLocaleString("fa-IR")} تومان
                      </span>
                      <span className="text-[13px] text-ink/70">{fa(p.payment_date)}</span>
                      <StatusPill
                        tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}
                      >
                        {p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}
                      </StatusPill>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Admin Sections */}
            {isAdmin && activeTab === "overview" && (
              <>
                <Card className="lg:col-span-2">
                  <h2 className="text-lg font-bold text-ink">آمار کلی</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border-2 border-line/50 bg-blush/30 p-4">
                      <div className="flex items-center gap-2 text-ink/70">
                        <Users size={18} />
                        <span className="text-[12px] font-semibold">کل کاربران</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-ink">{stats.totalUsers.toLocaleString("fa-IR")}</p>
                    </div>
                    <div className="rounded-2xl border-2 border-line/50 bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <ShieldCheck size={18} />
                        <span className="text-[12px] font-semibold">اشتراک فعال</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">{stats.activeSubscriptions.toLocaleString("fa-IR")}</p>
                    </div>
                    <div className="rounded-2xl border-2 border-line/50 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-amber-700">
                        <DollarSign size={18} />
                        <span className="text-[12px] font-semibold">در انتظار تأیید</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-amber-700">{stats.pendingPayments.toLocaleString("fa-IR")}</p>
                    </div>
                    <div className="rounded-2xl border-2 border-line/50 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Calendar size={18} />
                        <span className="text-[12px] font-semibold">درآمد کل</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-blue-700">{stats.totalRevenue.toLocaleString("fa-IR")} تومان</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {isAdmin && activeTab === "payments" && (
              <Card className="lg:col-span-2">
                <h2 className="text-lg font-bold text-ink">درخواست‌های پرداخت</h2>
                {payments.data?.length === 0 ? (
                  <p className="mt-3 text-[13px] text-ink/60">درخواستی ثبت نشده است.</p>
                ) : (
                  <div className="mt-4 flex flex-col gap-4">
                    {payments.data?.map((p) => (
                      <div key={p.id} className="rounded-2xl border-2 border-line/50 bg-cream/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-ink">{p.name || "بدون نام"}</p>
                            <p dir="ltr" className="text-[12px] text-ink/60">{p.email}</p>
                          </div>
                          <StatusPill tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}>
                            {p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}
                          </StatusPill>
                        </div>
                        <p className="mt-2 text-[13px] text-ink/70">{p.amount.toLocaleString("fa-IR")} تومان · {fa(p.payment_date)}</p>
                        {p.note && <p className="mt-2 text-[13px] text-ink/70">یادداشت: {p.note}</p>}
                        {p.receiptUrl && (
                          <a
                            href={p.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline"
                          >
                            <FileText size={14} /> مشاهده رسید
                          </a>
                        )}
                        {p.status === "pending" && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={3650}
                              value={days[p.id] ?? "30"}
                              onChange={(e) => setDays((d) => ({ ...d, [p.id]: e.target.value }))}
                              className="w-24 rounded-full border-2 border-line bg-cream px-3 py-2 text-center text-[13px] text-ink"
                            />
                            <span className="text-[12px] text-ink/60">روز</span>
                            <PrimaryButton
                              onClick={() => approveM.mutate({ paymentId: p.id, days: Number(days[p.id] ?? 30) })}
                              disabled={approveM.isPending}
                            >
                              تأیید و فعال‌سازی
                            </PrimaryButton>
                            <button
                              onClick={() => rejectM.mutate(p.id)}
                              className="rounded-full border-2 border-red-300 px-4 py-2 text-[12px] font-bold text-red-700"
                            >
                              رد کردن
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {isAdmin && activeTab === "users" && (
              <Card className="lg:col-span-2">
                <h2 className="text-lg font-bold text-ink">مدیریت کاربران</h2>
                <div className="mt-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
                    <input
                      type="text"
                      placeholder="جستجوی کاربر..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border-2 border-line bg-cream pr-10 pl-4 py-2 text-[13px] text-ink placeholder:text-ink/40"
                    />
                  </div>
                </div>
                {filteredUsers.length === 0 ? (
                  <p className="mt-3 text-[13px] text-ink/60">کاربری یافت نشد.</p>
                ) : (
                  <div className="mt-4 flex flex-col gap-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-2xl border-2 border-line/50 bg-cream/60 p-4 transition-all hover:bg-blush/40"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-ink">{user.name || "بدون نام"}</p>
                            <p dir="ltr" className="text-[12px] text-ink/60">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusPill tone={user.isActive ? "ok" : "muted"}>
                              {user.isActive ? "فعال" : "غیرفعال"}
                            </StatusPill>
                            <button
                              onClick={() => setSelectedUserId(user.id)}
                              className="flex items-center gap-1 rounded-full border-2 border-line bg-blush px-3 py-1.5 text-[12px] font-bold text-ink transition-all hover:bg-blush-deep"
                            >
                              <Eye size={14} /> جزئیات
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[12px] text-ink/60">
                          <span>ثبت‌نام: {fa(user.created_at)}</span>
                          <span>پرداخت‌ها: {user.payments.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* User Details Modal */}
            {selectedUserId && userDetails.data && (
              <Card className="lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-ink">جزئیات کاربر</h2>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="rounded-full border-2 border-line px-3 py-1.5 text-[12px] font-bold text-ink transition-all hover:bg-blush"
                  >
                    بستن
                  </button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="mb-1.5 block text-[13px] font-semibold text-ink">نام</span>
                    <p className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2 text-sm text-ink">
                      {userDetails.data.profile.name || "بدون نام"}
                    </p>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[13px] font-semibold text-ink">ایمیل</span>
                    <p dir="ltr" className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2 text-left text-sm text-ink">
                      {userDetails.data.profile.email}
                    </p>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[13px] font-semibold text-ink">وضعیت اشتراک</span>
                    <StatusPill tone={userDetails.data.isActive ? "ok" : "muted"}>
                      {userDetails.data.isActive ? "فعال" : "غیرفعال"}
                    </StatusPill>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[13px] font-semibold text-ink">تاریخ ثبت‌نام</span>
                    <p className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2 text-sm text-ink">
                      {fa(userDetails.data.profile.created_at)}
                    </p>
                  </div>
                  {userDetails.data.subscription && (
                    <>
                      <div>
                        <span className="mb-1.5 block text-[13px] font-semibold text-ink">شروع اشتراک</span>
                        <p className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2 text-sm text-ink">
                          {fa(userDetails.data.subscription.start_date)}
                        </p>
                      </div>
                      <div>
                        <span className="mb-1.5 block text-[13px] font-semibold text-ink">پایان اشتراک</span>
                        <p className="rounded-full border-2 border-line/40 bg-cream/60 px-4 py-2 text-sm text-ink">
                          {fa(userDetails.data.subscription.end_date)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-ink">تاریخچه پرداخت‌ها</h3>
                  {userDetails.data.payments.length === 0 ? (
                    <p className="mt-2 text-[13px] text-ink/60">پرداختی ثبت نشده است.</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-line/30">
                      {userDetails.data.payments.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                          <span className="text-sm font-semibold text-ink">
                            {p.amount.toLocaleString("fa-IR")} تومان
                          </span>
                          <span className="text-[12px] text-ink/70">{fa(p.payment_date)}</span>
                          <StatusPill
                            tone={p.status === "approved" ? "ok" : p.status === "pending" ? "warn" : "bad"}
                          >
                            {p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}
                          </StatusPill>
                          {p.receiptUrl && (
                            <a
                              href={p.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] font-semibold text-blue-600 hover:underline"
                            >
                              رسید
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}
