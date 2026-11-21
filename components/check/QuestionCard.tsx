"use client";

import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";

export type Option<V> = { value: V; label: string };

type Props<V extends string | number | boolean> = {
  title: string;
  why?: string;
  explanation?: string;
  options: Option<V>[];
  selected?: V;
  onSelect: (value: V) => void;
  onNotSure: () => void;
};

const BUTTON =
  "w-full min-h-[48px] min-w-[44px] rounded-lg border px-4 py-3 text-left text-base font-semibold";

// Decorative check glyph inside the 20px square; shown only when the row is selected.
const CHECK_ICON = (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6.5l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function QuestionCard<V extends string | number | boolean>({
  title,
  why,
  explanation,
  options,
  selected,
  onSelect,
  onNotSure,
}: Props<V>) {
  const { lang } = useLang();

  return (
    <section aria-labelledby="check-question" className="question-rise flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 id="check-question" className="type-section">
          {title}
        </h2>
        {explanation ? <p className="text-base leading-[26px] text-slate-700">{explanation}</p> : null}
        {why ? (
          <p className="text-sm text-slate-600">
            {t("check.whyWeAsk", lang)}: {why}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selected !== undefined && selected === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className="option-row"
            >
              <span className="option-box">{CHECK_ICON}</span>
              <span className="min-w-0 flex-1 break-words">{option.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onNotSure}
          className={`${BUTTON} border-dashed border-slate-400 bg-white text-slate-700`}
        >
          {t("check.notSure", lang)}
        </button>
      </div>
    </section>
  );
}
