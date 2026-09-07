import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Card, Field, PrimaryButton } from "@/components/PageShell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام — English Hasti" },
      {
        name: "description",
        content: "وارد حساب English Hasti شوید یا حساب تازه بسازید تا به درس‌های ویژه دسترسی پیدا کنید.",
      },
      { property: "og:title", content: "ورود و ثبت‌نام — English Hasti" },
      { property: "og:description", content: "ورود یا ساخت حساب کاربری English Hasti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      } else if (mode === "signup") {
        if (password.length < 6) throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        setNotice("حساب ساخته شد. اگر تأیید ایمیل فعال باشد، لینک تأیید برایتان ارسال شده است.");
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("لینک بازیابی رمز عبور به ایمیل شما ارسال شد.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطایی رخ داد.";
      setError(
        /invalid login/i.test(msg)
          ? "ایمیل یا رمز عبور درست نیست."
          : /already registered|already exists/i.test(msg)
            ? "این ایمیل قبلاً ثبت شده است."
            : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-script text-5xl text-ink">
          {mode === "signin" ? "خوش برگشتی" : mode === "signup" ? "عضویت" : "بازیابی رمز"}
        </h1>
        <p className="mt-2 text-center text-sm text-ink/70">
          {mode === "reset"
            ? "ایمیلت را بنویس تا لینک تغییر رمز برایت بفرستیم."
            : "با یک حساب کاربری به درس‌های ویژه دسترسی داشته باش."}
        </p>

        <Card className="mt-6">
          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <Field
                label="نام"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
              />
            )}
            <Field
              label="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            {mode !== "reset" && (
              <Field
                label="رمز عبور"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                dir="ltr"
              />
            )}

            {error && <p className="text-[13px] font-semibold text-red-700">{error}</p>}
            {notice && <p className="text-[13px] font-semibold text-emerald-800">{notice}</p>}

            <PrimaryButton type="submit" disabled={busy}>
              {busy
                ? "لطفاً صبر کنید…"
                : mode === "signin"
                  ? "ورود"
                  : mode === "signup"
                    ? "ساخت حساب"
                    : "ارسال لینک بازیابی"}
            </PrimaryButton>
          </form>

          <div className="mt-5 flex flex-col gap-2 text-center text-[13px] text-ink/80">
            {mode !== "signin" && (
              <button type="button" onClick={() => setMode("signin")} className="hover:underline">
                حساب داری؟ وارد شو
              </button>
            )}
            {mode !== "signup" && (
              <button type="button" onClick={() => setMode("signup")} className="hover:underline">
                حساب نداری؟ ثبت‌نام کن
              </button>
            )}
            {mode !== "reset" && (
              <button type="button" onClick={() => setMode("reset")} className="hover:underline">
                رمزت را فراموش کرده‌ای؟
              </button>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
