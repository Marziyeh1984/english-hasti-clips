import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="mx-auto flex max-w-2xl items-center justify-between rounded-full border border-border bg-bg2/90 px-3 py-2 shadow-float backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-green-chip text-foreground transition-colors hover:bg-accent"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to="/" className="text-base font-bold tracking-tight">
          English <span className="text-gold">Hasti</span>
        </Link>

        <Link
          to="/signup"
          className="rounded-full bg-lime px-4 py-2 text-[13px] font-bold text-background transition-transform hover:scale-[1.03]"
        >
          عضویت
        </Link>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-2xl rounded-2xl border border-border bg-card/95 p-4 shadow-float backdrop-blur-xl">
          <div className="flex flex-col gap-1 text-right">
            <a
              href="#lessons"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-green-chip"
            >
              نمونه درس‌ها
            </a>
            <a
              href="#plan"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-green-chip"
            >
              پلن اشتراک
            </a>
            <a
              href="#how"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-green-chip"
            >
              چطور کار می‌کنه
            </a>
            <a
              href={SITE.telegramChannel}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-green-chip"
            >
              کانال تلگرام
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-green-chip"
            >
              اینستاگرام
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
