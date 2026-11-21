"use client";
import Link from "next/link";
import { t } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";
import LangToggle from "./LangToggle";

const NAV_LINKS = [
  { href: "/check", key: "nav.eligibility" },
  { href: "/checklist", key: "nav.checklist" },
  { href: "/track", key: "nav.tracker" },
];

export default function Header() {
  const { lang } = useLang();
  return (
    <header className="border-b border-navy bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:h-20 sm:flex-row sm:items-center sm:gap-6 sm:py-0">
        <div className="flex items-center justify-between gap-3 sm:contents">
          <Link href="/" className="flex items-center gap-3 sm:order-1">
            <img src="/icon.svg" width={36} height={36} alt="" aria-hidden="true" className="h-9 w-9 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="text-[26px] font-semibold text-navy sm:text-[30px]" style={{ fontFamily: "var(--font-newsreader), serif" }}>
                {t("brand.haq", lang)}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-3">{t("brand.sahayak", lang)}</span>
            </span>
          </Link>
          <div className="sm:order-3">
            <LangToggle />
          </div>
        </div>
        <nav aria-label={t("nav.label", lang)} className="flex gap-5 overflow-x-auto sm:order-2 sm:gap-6 sm:overflow-visible">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative inline-flex min-h-11 shrink-0 items-center text-base font-medium text-ink transition-colors duration-[180ms] hover:text-teal focus-visible:text-teal"
            >
              {t(link.key, lang)}
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-0 block h-0.5 w-full origin-left scale-x-0 bg-marigold transition-transform duration-[180ms] ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
