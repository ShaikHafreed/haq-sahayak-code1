"use client";

import type { ChecklistItem as Item } from "@/lib/checklist/buildChecklist";
import { t, type Lang } from "@/lib/i18n";
import type { Bilingual } from "@/lib/types";

type Props = {
  item: Item;
  checked: boolean;
  onToggle: (id: string) => void;
  lang: Lang;
};

const pick = (b: Bilingual, lang: Lang) => b[lang] || b.en;

export default function ChecklistItem({ item, checked, onToggle, lang }: Props) {
  const { document: d, schemes } = item;
  const names = schemes.map((s) => pick(s.name, lang)).join(", ");

  return (
    <li className="flex flex-col">
      <label className="flex min-h-[48px] w-full min-w-0 cursor-pointer items-start gap-3 py-2">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0"
          checked={checked}
          onChange={() => onToggle(d.id)}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1 break-words">
          <span className={`text-base font-semibold leading-[26px] text-navy ${checked ? "line-through" : ""}`}>
            {pick(d.name, lang)}
          </span>
          <span className="text-base leading-[26px] text-navy">
            {t("checklist.why", lang)}: {names}
          </span>
          <span className="text-base leading-[26px] text-ink-3">
            {d.typicalDays === null
              ? t("checklist.untimed", lang)
              : `${t("checklist.days", lang)}: ${String(d.typicalDays)}`}
          </span>
        </span>
      </label>
    </li>
  );
}
