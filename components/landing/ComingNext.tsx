"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

export default function ComingNext() {
  const { lang } = useLang();

  return (
    <section className="flex min-h-[44px] items-center gap-2 border-t border-slate-200 pt-4">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <p className="text-sm text-slate-600">{t("landing.next", lang)}</p>
    </section>
  );
}
