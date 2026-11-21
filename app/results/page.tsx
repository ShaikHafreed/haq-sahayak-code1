"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import SchemeCard from "@/components/results/SchemeCard";
import { getSchemes } from "@/lib/data";
import { conflictPairs } from "@/lib/engine/conflicts";
import { groupResults, type Result } from "@/lib/engine/groupResults";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import { loadProfile } from "@/lib/storage/profile";
import type { Profile } from "@/lib/types";

const BUTTON =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0F766E] px-5 py-3 text-base font-semibold text-white";

function Section({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: Result[];
  renderItem: (r: Result) => ReactNode;
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {items.map(renderItem)}
    </section>
  );
}

export default function ResultsPage() {
  const { lang } = useLang();
  // loadProfile() reads localStorage, so it runs after mount; the server render stays empty.
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (profile === null) return null;

  // loadProfile() returns {} when nothing is saved.
  if (Object.keys(profile).length === 0) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <p className="text-base text-slate-700">{t("results.noProfile", lang)}</p>
        <Link href="/check" className={BUTTON}>
          {t("results.startCheck", lang)}
        </Link>
      </div>
    );
  }

  const groups = groupResults(profile, getSchemes());
  const conflictIds = new Set(
    conflictPairs(groups.likely.map((r) => ({ scheme: r.scheme, status: r.evaluation.status }))).flat(),
  );

  const renderItem = (r: Result) => (
    <SchemeCard
      key={r.scheme.id}
      scheme={r.scheme}
      evaluation={r.evaluation}
      lang={lang}
      conflict={conflictIds.has(r.scheme.id)}
    />
  );

  return (
    <div className="flex flex-col gap-8 py-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("results.title", lang)}</h1>
      <Link href="/checklist" className="text-base font-semibold text-teal-800 underline">
        {t("checklist.linkLabel", lang)}
      </Link>
      <Link href="/track" className="text-base font-semibold text-teal-800 underline">
        {t("track.link", lang)}
      </Link>
      <Section title={t("results.group.likely", lang)} items={groups.likely} renderItem={renderItem} />
      <Section title={t("results.group.check", lang)} items={groups.check} renderItem={renderItem} />
      <Section
        title={t("results.group.closed", lang)}
        items={groups.closedOrPaused}
        renderItem={renderItem}
      />
      {groups.not_eligible.length > 0 ? (
        <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <summary className="min-h-[44px] cursor-pointer text-lg font-bold text-slate-800">
            {t("results.group.notEligible", lang)}
          </summary>
          <div className="flex flex-col gap-3 pt-4">{groups.not_eligible.map(renderItem)}</div>
        </details>
      ) : null}
      <p className="text-sm text-slate-600">{t("results.decision", lang)}</p>
    </div>
  );
}
