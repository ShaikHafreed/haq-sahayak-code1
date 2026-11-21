import Link from "next/link";
import { t, type Lang } from "../../lib/i18n";
import type { Evaluation, RuleResult } from "../../lib/engine/evaluate";
import type { Bilingual, Scheme } from "../../lib/types";

type Props = { scheme: Scheme; evaluation: Evaluation; lang: Lang; conflict: boolean };

const pick = (b: Bilingual, lang: Lang) => b[lang] || b.en;

// Each result has a glyph and a word, so status never depends on colour alone.
const RESULT_MARK: Record<RuleResult, { glyph: string; key: string; cls: string }> = {
  pass: { glyph: "✓", key: "card.met", cls: "bg-emerald-100 text-emerald-900" },
  fail: { glyph: "✗", key: "card.notMet", cls: "bg-slate-200 text-slate-700" },
  unknown: { glyph: "?", key: "card.unknown", cls: "bg-amber-100 text-amber-900" },
};

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-base font-semibold text-slate-800";

export default function SchemeCard({ scheme, evaluation, lang, conflict }: Props) {
  const missing = evaluation.missingFields.length;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-bold text-slate-900">{pick(scheme.name, lang)}</h3>
      <p className="text-base text-slate-700">{pick(scheme.benefit, lang)}</p>
      <p className="text-sm font-semibold text-teal-800">
        {t("card.paidTo", lang)}: {t("paidTo." + scheme.paidTo, lang)}
      </p>

      {scheme.status === "unknown" ? (
        <p className="text-base text-amber-900">{t("card.unknownStatus", lang)}</p>
      ) : null}
      {scheme.status === "closed" ? (
        <div className="flex flex-col gap-1 text-base text-slate-800">
          <p className="font-semibold">{t("card.closed", lang)}</p>
          {scheme.window.note ? (
            <p>
              {t("card.window", lang)}: {pick(scheme.window.note, lang)}
            </p>
          ) : null}
        </div>
      ) : null}
      {scheme.status === "paused" && scheme.window.note ? (
        <p className="text-sm text-slate-600">{pick(scheme.window.note, lang)}</p>
      ) : null}

      {conflict ? (
        <p className="text-base font-semibold text-amber-900">
          <span aria-hidden="true">⚠ </span>
          {t("card.chooseOne", lang)}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {evaluation.rules.map((r, i) => {
          const mark = RESULT_MARK[r.result];
          return (
            <li key={i} className="flex items-start gap-2 text-base text-slate-800">
              <span
                aria-hidden="true"
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold ${mark.cls}`}
              >
                {mark.glyph}
              </span>
              <span>
                {pick(r.label, lang)}{" "}
                <span className="text-sm text-slate-600">({t(mark.key, lang)})</span>
              </span>
            </li>
          );
        })}
      </ul>

      {missing > 0 ? (
        <Link href="/check" className={LINK_CLASS}>
          {t("card.moreQuestionsPrefix", lang)} {String(missing)} {t("card.moreQuestionsSuffix", lang)}
        </Link>
      ) : null}

      <p className="text-sm text-slate-600">
        {scheme.lastVerified
          ? `${t("card.lastVerified", lang)}: ${scheme.lastVerified}`
          : t("results.verifyBefore", lang)}
      </p>
      <div className="flex flex-col gap-2">
        <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {t("card.officialSource", lang)}
        </a>
        <Link href={"/scheme/" + scheme.id} className={LINK_CLASS}>
          {t("results.details", lang)}
        </Link>
      </div>
    </div>
  );
}
