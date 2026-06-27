import { Send, Instagram, Globe } from "lucide-react";
import { SITE } from "@/lib/site";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <a
        href={SITE.telegramChannel}
        target="_blank"
        rel="noreferrer"
        aria-label="کانال تلگرام"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:scale-110"
      >
        <Send size={18} />
      </a>
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="اینستاگرام"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:scale-110"
      >
        <Instagram size={18} />
      </a>
      <a
        href={SITE.website}
        target="_blank"
        rel="noreferrer"
        aria-label="وب‌سایت"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:scale-110"
      >
        <Globe size={18} />
      </a>
    </div>
  );
}
