import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/lessons", label: "کتابخانه درس‌ها", internal: true },
  { href: "/#plan", label: "پلن اشتراک" },
  { href: "/#how", label: "چطور کار می‌کنه" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-full border-2 border-line bg-blush px-3 py-2.5 lg:max-w-5xl lg:px-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-all duration-300 hover:bg-blush-deep active:scale-90 lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) =>
            l.internal ? (
              <Link
                key={l.href}
                to={l.href}
                className="rounded-full px-3 py-2 text-[13px] text-ink transition-colors hover:bg-blush-deep"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-[13px] text-ink transition-colors hover:bg-blush-deep"
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <Link
          to="/"
          className="truncate text-center font-script text-2xl font-bold leading-none text-ink lg:text-3xl"
        >
          English Hasti
        </Link>

        <Link
          to="/signup"
          className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-[12px] font-bold text-cream transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-90 lg:px-6 lg:py-2.5 lg:text-[13px]"
        >
          عضویت
        </Link>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-2xl rounded-3xl border-2 border-line bg-blush p-4 lg:hidden">
          <div className="flex flex-col gap-1 text-center">
            <Link
              to="/lessons"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm text-ink transition-colors hover:bg-blush-deep"
            >
              کتابخانه درس‌ها
            </Link>
            {[
              { href: "/#plan", label: "پلن اشتراک" },
              { href: "/#how", label: "چطور کار می‌کنه" },
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
