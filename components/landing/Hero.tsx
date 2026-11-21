"use client";

import Link from "next/link";
import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

export default function Hero() {
  const { lang } = useLang();

  return (
    <section className="flex flex-col items-start gap-5 py-8">
      <h1 className="text-2xl font-bold leading-snug text-slate-900">
        {t("landing.hero.promise", lang)}
      </h1>
      <Link
        href="/check"
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white"
      >
        {t("landing.hero.cta", lang)}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
