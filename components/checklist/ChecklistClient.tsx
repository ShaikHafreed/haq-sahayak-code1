"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ChecklistItem from "@/components/checklist/ChecklistItem";
import { earliestStartBy, mergeDocuments, sortDocuments } from "@/lib/checklist/buildChecklist";
import { getDocuments, getSchemes } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import { loadProfile } from "@/lib/storage/profile";
import type { Profile } from "@/lib/types";

const READY_KEY = "haq.ready";
const BUTTON =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0F766E] px-5 py-3 text-base font-semibold text-white";

function saveReady(ids: string[]) {
  try {
    window.localStorage.setItem(READY_KEY, JSON.stringify(ids));
  } catch {
    // Storage full or blocked: ticks still work for this visit.
  }
}

export default function ChecklistClient() {
  const { lang } = useLang();
  // Storage is read after mount; the server render stays empty.
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState<string[]>([]);

  useEffect(() => {
    setProfile(loadProfile());
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(READY_KEY) ?? "[]");
      if (Array.isArray(parsed)) setReady(parsed.filter((x): x is string => typeof x === "string"));
    } catch {
      // Corrupt value: start with nothing ticked.
    }
  }, []);

  if (profile === null) return null;

  if (Object.keys(profile).length === 0) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <p className="text-base text-slate-700">{t("checklist.noProfile", lang)}</p>
        <Link href="/check" className={BUTTON}>
          {t("checklist.checkEligibility", lang)}
        </Link>
      </div>
    );
  }

  const schemes = getSchemes();
  const items = sortDocuments(mergeDocuments(schemes, profile));
  const today = new Date().toISOString().slice(0, 10);
  const startDate = earliestStartBy(schemes, profile, ready, getDocuments(), today);

  const toggle = (id: string) => {
    const next = ready.includes(id) ? ready.filter((x) => x !== id) : [...ready, id];
    setReady(next);
    saveReady(next);
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">{t("checklist.title", lang)}</h1>
        <p className="text-lg font-semibold text-teal-800">
          {startDate
            ? `${t("checklist.startBy", lang)}: ${startDate}`
            : t("checklist.startEarly", lang)}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="text-base text-slate-700">{t("checklist.none", lang)}</p>
      ) : (
        <ul className="flex flex-col gap-3 divide-y divide-slate-200">
          {items.map((item) => (
            <ChecklistItem
              key={item.document.id}
              item={item}
              checked={ready.includes(item.document.id)}
              onToggle={toggle}
              lang={lang}
            />
          ))}
        </ul>
      )}
      <button type="button" className={`${BUTTON} no-print`} onClick={() => window.print()}>
        {t("checklist.print", lang)}
      </button>
    </div>
  );
}
