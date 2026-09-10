import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE } from "@/lib/site";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:py-14">{children}</main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-12">
        <div className="rounded-3xl border-2 border-line bg-blush p-6 text-center">
          <p className="font-script text-3xl text-ink">{SITE.name}</p>
          <p className="mt-2 text-sm text-ink/70">{SITE.supportEmail}</p>
          <div className="mt-4 flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border-2 border-line bg-blush p-6 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-full border-2 border-line bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 focus:ring-ink/20"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-ink px-6 py-2.5 text-[13px] font-bold text-cream transition-all duration-300 hover:scale-[1.03] hover:opacity-90 active:scale-95 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "bad" | "muted";
  children: ReactNode;
}) {
  const map = {
    ok: "bg-emerald-600 text-white",
    warn: "bg-amber-500 text-white",
    bad: "bg-red-600 text-white",
    muted: "bg-ink/10 text-ink",
  } as const;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold ${map[tone]}`}>
      {children}
    </span>
  );
}

export function BackToHome({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/70 transition-colors hover:text-ink ${className}`}
    >
      <ArrowRight size={15} /> برگشت به صفحه اصلی
    </Link>
  );
}
