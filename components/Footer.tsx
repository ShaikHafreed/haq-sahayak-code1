"use client";

import Link from "next/link";
import { t } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="mt-auto border-t border-gray-200 px-4 py-4 text-center text-sm">
      <div className="mx-auto max-w-md">
        <Link href="/privacy" className="font-medium text-primary underline">
          {t("footer.privacy", lang)}
        </Link>
        <p className="mt-1 break-words text-gray-600">{t("footer.demoNote", lang)}</p>
      </div>
    </footer>
  );
}
