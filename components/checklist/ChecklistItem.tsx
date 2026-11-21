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
      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0"
          checked={checked}
          onChange={() => onToggle(d.id)}
        />
        <span className="flex flex-col gap-1">
          <span className={`text-base font-semibold text-slate-900 ${checked ? "line-through" : ""}`}>
            {pick(d.name, lang)}
          </span>
          <span className="text-sm text-slate-700">
            {t("checklist.why", lang)}: {names}
          </span>
          <span className="text-sm text-slate-600">
            {d.typicalDays === null
              ? t("checklist.untimed", lang)
              : `${t("checklist.days", lang)}: ${String(d.typicalDays)}`}
          </span>
        </span>
      </label>
    </li>
  );
}
