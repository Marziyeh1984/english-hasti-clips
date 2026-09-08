import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Card, Field, PrimaryButton } from "@/components/PageShell";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "تعیین رمز تازه — English Hasti" },
      { name: "description", content: "برای حساب English Hasti خود یک رمز عبور تازه انتخاب کنید." },
      { property: "og:title", content: "تعیین رمز تازه — English Hasti" },
      { property: "og:description", content: "انتخاب رمز عبور تازه برای حساب English Hasti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    if (password !== confirm) return setError("دو رمز یکسان نیستند.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError("تغییر رمز ممکن نشد. دوباره لینک بازیابی بگیر.");
    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-script text-5xl text-ink">رمز تازه</h1>
        <Card className="mt-6">
          {!ready ? (
            <p className="text-center text-[13px] text-ink/70">
              این صفحه را از روی لینکی که به ایمیلت فرستادیم باز کن.
            </p>
          ) : done ? (
            <p className="text-center text-[13px] font-semibold text-emerald-800">
              رمز عوض شد. داریم می‌بریمت به داشبورد…
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Field
                label="رمز تازه"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Field
                label="تکرار رمز تازه"
                type="password"
                dir="ltr"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              {error && <p className="text-[13px] font-semibold text-red-700">{error}</p>}
              <PrimaryButton type="submit" disabled={busy}>
                {busy ? "در حال ذخیره…" : "ذخیره رمز تازه"}
              </PrimaryButton>
            </form>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
