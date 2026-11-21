"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

const TRUST_KEYS = [
  "landing.trust.free",
  "landing.trust.noAadhaar",
  "landing.trust.official",
  "landing.trust.decision",
] as const;

export default function TrustStrip() {
  const { lang } = useLang();

  return (
    <section aria-label={t("landing.trust.free", lang)} className="rounded-lg bg-slate-100 px-4 py-4">
      <ul className="flex flex-col gap-2">
        {TRUST_KEYS.map((key) => (
          <li key={key} className="flex min-h-[44px] items-center gap-2 text-sm text-slate-800">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
            <span>{t(key, lang)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
