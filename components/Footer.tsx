"use client";
import Link from "next/link";
import { t } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-navy text-white print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-col leading-none">
          <span className="text-6xl font-semibold" style={{ fontFamily: "var(--font-newsreader), serif" }}>
            {t("brand.haq", lang)}
          </span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">{t("brand.sahayak", lang)}</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm">
          <Link href="/privacy" className="underline underline-offset-4 hover:text-marigold">{t("footer.privacy", lang)}</Link>
          <Link href="/terms" className="underline underline-offset-4 hover:text-marigold">{t("footer.terms", lang)}</Link>
        </nav>
        <p className="text-sm text-strip">{t("footer.disclaimer", lang)}</p>
      </div>
    </footer>
  );
}
