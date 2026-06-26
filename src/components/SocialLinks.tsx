import { Send, Instagram } from "lucide-react";
import { SITE } from "@/lib/site";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <a
        href={SITE.telegramChannel}
        target="_blank"
        rel="noreferrer"
        aria-label="کانال تلگرام"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-green-chip text-gold transition-colors hover:bg-accent"
      >
        <Send size={19} />
      </a>
      <a
        href={SITE.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="اینستاگرام"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-green-chip text-gold transition-colors hover:bg-accent"
      >
        <Instagram size={19} />
      </a>
    </div>
  );
}
