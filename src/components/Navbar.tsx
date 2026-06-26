import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-full border-2 border-line bg-blush px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush-deep"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          to="/"
          className="truncate text-center font-script text-2xl font-bold leading-none text-ink"
        >
          English Hasti
        </Link>

        <Link
          to="/signup"
          className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-[12px] font-bold text-cream transition-opacity hover:opacity-90"
        >
          عضویت
        </Link>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-2xl rounded-3xl border-2 border-line bg-blush p-4">
          <div className="flex flex-col gap-1 text-center">
            {[
              { href: "#lessons", label: "نمونه درس‌ها" },
              { href: "#plan", label: "پلن اشتراک" },
              { href: "#how", label: "چطور کار می‌کنه" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-ink transition-colors hover:bg-blush-deep"
              >
                {l.label}
              </a>
            ))}
            <a
              href={SITE.telegramChannel}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-3 py-3 text-sm text-ink transition-colors hover:bg-blush-deep"
            >
              کانال تلگرام
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-3 py-3 text-sm text-ink transition-colors hover:bg-blush-deep"
            >
              اینستاگرام
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
