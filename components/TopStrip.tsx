"use client";
import { t } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";

export default function TopStrip({ checkedDate }: { checkedDate: string | null }) {
  const { lang } = useLang();
  return (
    <div className="h-9 w-full bg-navy text-[12px] text-strip print:hidden">
      <div className="mx-auto flex h-9 max-w-5xl items-center justify-between gap-4 px-4">
        <span className="truncate">{t("topStrip.tagline", lang)}</span>
        {checkedDate && (
          <span className="shrink-0 whitespace-nowrap">
            {t("topStrip.dataChecked", lang)}{" "}
            <span style={{ fontFamily: "var(--font-plex-mono), monospace" }}>{checkedDate}</span>
          </span>
        )}
      </div>
    </div>
  );
}
