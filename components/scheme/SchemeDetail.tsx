"use client";

import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Bilingual, DocumentType, Scheme } from "@/lib/types";

type Props = { scheme: Scheme; documents: DocumentType[] };

const pick = (b: Bilingual, lang: Lang) => b[lang] || b.en;
const TITLE = "font-[family-name:var(--font-newsreader)] text-[48px] leading-[52px] font-bold text-navy";
const H2 = "font-[family-name:var(--font-newsreader)] text-[38px] leading-[44px] font-bold text-navy";
const SECTION = "flex flex-col gap-2 border-t-2 border-navy pt-4";
const ROW = "border-b border-ink-3 py-2 last:border-b-0";
const LINK_CLASS =
  "inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[4px] border border-navy bg-white px-4 py-2 text-base font-semibold leading-[26px] text-navy";

export default function SchemeDetail({ scheme, documents }: Props) {
  const { lang } = useLang();
  const steps = scheme.applySteps[lang === "te" ? "te" : "en"];

  return (
    <div className="flex flex-col gap-6 py-6">
      <section className="flex flex-col gap-2">
        <h1 className={TITLE}>{pick(scheme.name, lang)}</h1>
        <h2 className={H2}>{t("detail.benefit", lang)}</h2>
        <p className="text-base leading-[26px] text-ink">{pick(scheme.benefit, lang)}</p>
        <p className="text-sm font-semibold text-teal">
          {t("card.paidTo", lang)}: {t("paidTo." + scheme.paidTo, lang)}
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H2}>{t("detail.rules", lang)}</h2>
        <ul className="list-disc pl-5 text-base leading-[26px] text-ink">
          {scheme.rules.map((r, i) => (
            <li key={i} className={ROW}>
              {pick(r.label, lang)}
            </li>
          ))}
        </ul>
        {(scheme.notStated ?? []).map((n, i) => (
          <div key={i} className="flex flex-col gap-1 rounded-[4px] border border-ink-3 bg-white p-3">
            <p className="text-sm font-semibold text-ink-3">{t("detail.notStated", lang)}</p>
            <p className="text-base leading-[26px] text-ink">{pick(n, lang)}</p>
          </div>
        ))}
      </section>

      <section className={SECTION}>
        <h2 className={H2}>{t("detail.documents", lang)}</h2>
        <ul className="flex flex-col text-base leading-[26px] text-ink">
          {documents.map((d) => (
            <li key={d.id} className={`flex flex-col ${ROW}`}>
              <span>{pick(d.name, lang)}</span>
              <span className="text-sm text-ink-3">
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

      <section className={SECTION}>
        <h2 className={H2}>{t("detail.applySteps", lang)}</h2>
        <ol className="list-decimal pl-5 text-base leading-[26px] text-ink">
          {steps.map((s, i) => (
            <li key={i} className={ROW}>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className={`${SECTION} gap-3`}>
        <h2 className={H2}>{t("scheme.source", lang)}</h2>
        <p className="text-sm text-ink-3">
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

      <Link href="/track" className={LINK_CLASS}>
        {t("track.link", lang)}
      </Link>

      <p className="text-sm text-ink-3">{t("results.decision", lang)}</p>
    </div>
  );
}
