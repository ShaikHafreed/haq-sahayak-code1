"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

const STEPS = [
  { key: "landing.how.step1", heading: "Answer a few questions" },
  { key: "landing.how.step2", heading: "See what you may qualify for" },
  { key: "landing.how.step3", heading: "Confirm on the official portal" },
] as const;

export default function HowItWorks() {
  const { lang } = useLang();

  return (
    <section aria-labelledby="how-it-works-title" className="bg-marigold-tint">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-16 md:py-20">
        <h2
          id="how-it-works-title"
          className="landing-display text-[32px] leading-10 text-navy"
        >
          {t("landing.how.title", lang)}
        </h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.key} className="flex flex-col">
              <span
                aria-hidden="true"
                className="landing-display text-[60px] leading-[60px] text-navy"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{step.heading}</h3>
              <p className="mt-2 text-base leading-6 text-ink-2">{t(step.key, lang)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
