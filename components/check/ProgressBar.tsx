"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

type Props = { current: number; total: number };

export default function ProgressBar({ current, total }: Props) {
  const { lang } = useLang();
  const max = Math.max(total, 1);
  const value = Math.min(Math.max(current, 0), max);

  return (
    <div
      role="progressbar"
      aria-label={t("check.progress", lang)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} / ${max}`}
      className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${(value / max) * 100}%`, backgroundColor: "var(--color-teal)" }}
      />
    </div>
  );
}
