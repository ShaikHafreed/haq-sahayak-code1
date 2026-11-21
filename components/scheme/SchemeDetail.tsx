"use client";

import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Bilingual, DocumentType, Scheme } from "@/lib/types";

type Props = { scheme: Scheme; documents: DocumentType[] };

const pick = (b: Bilingual, lang: Lang) => b[lang] || b.en;
const H2 = "text-lg font-bold text-slate-900";
const LINK_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-base font-semibold text-slate-800";

export default function SchemeDetail({ scheme, documents }: Props) {
  const { lang } = useLang();
  const steps = scheme.applySteps[lang === "te" ? "te" : "en"];

  return (
    <div className="flex flex-col gap-6 py-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">{pick(scheme.name, lang)}</h1>
        <h2 className={H2}>{t("detail.benefit", lang)}</h2>
        <p className="text-base text-slate-700">{pick(scheme.benefit, lang)}</p>
        <p className="text-sm font-semibold text-teal-800">
          {t("card.paidTo", lang)}: {t("paidTo." + scheme.paidTo, lang)}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={H2}>{t("detail.rules", lang)}</h2>
        <ul className="list-disc pl-5 text-base text-slate-800">
          {scheme.rules.map((r, i) => (
            <li key={i}>{pick(r.label, lang)}</li>
          ))}
        </ul>
        {(scheme.notStated ?? []).map((n, i) => (
          <div key={i} className="flex flex-col gap-1 rounded-lg bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-700">{t("detail.notStated", lang)}</p>
            <p className="text-base text-slate-800">{pick(n, lang)}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={H2}>{t("detail.documents", lang)}</h2>
        <ul className="flex flex-col gap-2 text-base text-slate-800">
          {documents.map((d) => (
            <li key={d.id} className="flex flex-col">
              <span>{pick(d.name, lang)}</span>
              <span className="text-sm text-slate-600">
                {d.typicalDays === null ? (
                  t("detail.timeVaries", lang)
                ) : (
                  <>
                    {t("detail.daysPrefix", lang)} {String(d.typicalDays)} {t("detail.daysSuffix", lang)}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={H2}>{t("detail.applySteps", lang)}</h2>
        <ol className="list-decimal pl-5 text-base text-slate-800">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={H2}>{t("scheme.source", lang)}</h2>
        <p className="text-sm text-slate-600">
          {scheme.lastVerified
            ? `${t("card.lastVerified", lang)}: ${scheme.lastVerified}`
            : t("results.verifyBefore", lang)}
        </p>
        <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {t("card.officialSource", lang)}
        </a>
      </section>

      <Link href="/checklist" className={LINK_CLASS}>
        {t("checklist.linkLabel", lang)}
      </Link>

      <p className="text-sm text-slate-600">{t("results.decision", lang)}</p>
    </div>
  );
}
