"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

const STEPS = [
  "landing.how.step1",
  "landing.how.step2",
  "landing.how.step3",
] as const;

export default function HowItWorks() {
  const { lang } = useLang();

  return (
    <section aria-labelledby="how-it-works-title" className="flex flex-col gap-4">
      <h2 id="how-it-works-title" className="text-lg font-bold text-slate-900">
        {t("landing.how.title", lang)}
      </h2>
      <ol className="flex flex-col gap-3">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <span className="text-base text-slate-800">{t(key, lang)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
