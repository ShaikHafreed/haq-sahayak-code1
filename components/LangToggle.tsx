"use client";

import { LANGS, t, type Lang } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";

export default function LangToggle() {
  const { lang, setLang } = useLang();

  const options: Lang[] = LANGS;

  return (
    <div role="group" aria-label="Language" className="flex gap-2">
      {options.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`min-h-[44px] min-w-[44px] rounded-md px-3 text-sm font-medium border-2 ${
              active
               ? "bg-white text-primary border-white"
                : "bg-transparent text-white border-white/60"
            }`}
          >
            {t(`header.langToggle.${code}`, lang)}
          </button>
        );
      })}
    </div>
  );
}
