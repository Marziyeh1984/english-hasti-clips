import { Send, Instagram, Globe } from "lucide-react";
import { SITE } from "@/lib/site";

export function SocialLinks({ className = "" }: { className?: string }) {
  const base =
    "group flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-90 active:rotate-6";
  const icon = "transition-transform duration-300 group-hover:scale-110 group-active:scale-90";

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <a
        href={SITE.telegramChannel}
        target="_blank"
        rel="noreferrer"
        aria-label="کانال تلگرام"
        className={base}
      >
        <Send size={18} className={icon} />
      </a>
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="اینستاگرام"
        className={base}
      >
        <Instagram size={18} className={icon} />
      </a>
      <a
        href={SITE.website}
        target="_blank"
        rel="noreferrer"
        aria-label="وب‌سایت"
        className={base}
      >
        <Globe size={18} className={icon} />
      </a>
    </div>
  );
}
