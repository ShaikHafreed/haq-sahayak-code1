"use client";

import Link from "next/link";
import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

const SAMPLES = [
  { persona: "lakshmi", nameKey: "landing.sample.lakshmi" },
  { persona: "ravi", nameKey: "landing.sample.ravi" },
  { persona: "saroja", nameKey: "landing.sample.saroja" },
] as const;

export default function SampleButtons() {
  const { lang } = useLang();

  return (
    <section aria-labelledby="sample-title" className="flex flex-col gap-3">
      <h2 id="sample-title" className="text-base font-semibold text-[var(--color-muted-text)]">
        {t("landing.sample.title", lang)}
      </h2>
      <div className="flex flex-col gap-3">
        {SAMPLES.map((sample) => (
          <Link
            key={sample.persona}
            href={`/check?persona=${sample.persona}`}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-base font-medium text-[var(--color-primary)]"
          >
            {t("landing.sample.label", lang)} {t(sample.nameKey, lang)}
          </Link>
        ))}
      </div>
    </section>
  );
}
