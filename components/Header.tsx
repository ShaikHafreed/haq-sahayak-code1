"use client";

import { t } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";
import LangToggle from "./LangToggle";

export default function Header() {
  const { lang } = useLang();

  return (
    <header className="bg-primary text-white">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-2">
        <span className="text-lg font-bold">{t("app.name", lang)}</span>
        <LangToggle />
      </div>
    </header>
  );
}
