import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount, updateMyProfile } from "@/lib/account.functions";
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
  const [name, setName] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["account"], queryFn: () => fetchAccount({}) });

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: authData }) => {
      setSignedInEmail(authData.user?.email?.trim().toLowerCase() ?? "");
    });
  }, []);

  const save = useMutation({
    mutationFn: (n: string) => saveProfile({ data: { name: n } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["account"] }),
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

  return (
    <PageShell>
      <BackToHome className="mb-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-script text-5xl text-ink">داشبورد من</h1>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-full border-2 border-line bg-blush px-4 py-2 text-[13px] font-bold text-ink transition-all hover:bg-blush-deep active:scale-95"
            >
              <ShieldCheck size={15} /> پنل مدیریت
            </Link>
          )}
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
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
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
                to="/library"
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
        </div>
      )}
    </PageShell>
  );
}
