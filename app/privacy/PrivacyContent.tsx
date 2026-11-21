"use client";

import { t } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";

const CONTACT_EMAIL = "hafreedshaik06@gmail.com";

export default function PrivacyContent() {
  const { lang } = useLang();

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-[min(720px,calc(100vw_-_2rem))] bg-paper py-6">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-[48px] font-normal leading-[52px] text-navy border-b-2 border-navy pb-3">
          {t("privacy.title", lang)}
        </h1>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p1", lang)}</p>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p2", lang)}</p>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p3", lang)}</p>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p4", lang)}</p>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p5", lang)}</p>
        <p className="text-base leading-[26px] text-navy">{t("privacy.p6", lang)}</p>
        <p className="text-base leading-[26px] text-navy">
          <span className="font-semibold">{t("privacy.contactLabel", lang)}:</span>{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
