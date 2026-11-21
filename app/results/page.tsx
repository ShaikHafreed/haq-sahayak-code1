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
  "btn-fill inline-flex min-h-[44px] items-center justify-center rounded bg-teal px-5 py-3 text-base font-semibold text-white";

const DISPLAY = "font-[family-name:var(--font-newsreader)]";

type Tone = "likely" | "check" | "closed";

// Status text plus a small square marker. Never a pill or a circle.
const STATUS_STYLE: Record<Tone, { text: string; marker: string; wrap: string }> = {
  likely: { text: "text-teal", marker: "bg-teal", wrap: "" },
  check: { text: "text-marigold-deep", marker: "bg-marigold-deep", wrap: "bg-marigold-tint px-2 py-1" },
  closed: { text: "text-ink-3", marker: "bg-ink-3", wrap: "" },
};

function Section({
  title,
  tone,
  items,
  renderItem,
}: {
  title: string;
  tone: Tone;
  items: Result[];
  renderItem: (r: Result) => ReactNode;
}) {
  if (items.length === 0) return null;
  const style = STATUS_STYLE[tone];
  return (
    <section className="flex flex-col gap-3 border-t-2 border-navy pt-4">
      <h2 className={`${DISPLAY} flex items-center gap-2 self-start text-[38px] leading-[44px] text-navy ${style.wrap}`}>
        <span aria-hidden="true" className={`inline-block h-3 w-3 ${style.marker}`} />
        {title}
      </h2>
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
        <p className="text-base leading-[26px] text-ink">{t("results.noProfile", lang)}</p>
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
      <h1 className={`${DISPLAY} text-[48px] leading-[52px] text-navy`}>{t("results.title", lang)}</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 border-t-2 border-navy pt-3">
          <span className={`${DISPLAY} text-[48px] leading-[52px] text-teal`}>{groups.likely.length}</span>
          <span className="text-base leading-[26px] text-ink-2">{t("results.group.likely", lang)}</span>
        </div>
        <div className="flex flex-col gap-1 border-t-2 border-navy pt-3">
          <span className={`${DISPLAY} text-[48px] leading-[52px] text-marigold-deep`}>{groups.check.length}</span>
          <span className="text-base leading-[26px] text-ink-2">{t("results.group.check", lang)}</span>
        </div>
        <div className="flex flex-col gap-1 border-t-2 border-navy pt-3">
          <span className={`${DISPLAY} text-[48px] leading-[52px] text-ink-3`}>{groups.closedOrPaused.length}</span>
          <span className="text-base leading-[26px] text-ink-2">{t("results.group.closed", lang)}</span>
        </div>
      </div>

      <Link href="/checklist" className="text-base leading-[26px] font-semibold text-teal underline">
        {t("checklist.linkLabel", lang)}
      </Link>
      <Link href="/track" className="text-base leading-[26px] font-semibold text-teal underline">
        {t("track.link", lang)}
      </Link>
      <Section
        title={t("results.group.likely", lang)}
        tone="likely"
        items={groups.likely}
        renderItem={renderItem}
      />
      <Section title={t("results.group.check", lang)} tone="check" items={groups.check} renderItem={renderItem} />
      <Section
        title={t("results.group.closed", lang)}
        tone="closed"
        items={groups.closedOrPaused}
        renderItem={renderItem}
      />
      {groups.not_eligible.length > 0 ? (
        <details className="border-t-2 border-navy bg-paper pt-4">
          <summary className={`${DISPLAY} min-h-[44px] cursor-pointer text-[38px] leading-[44px] text-ink-3`}>
            {t("results.group.notEligible", lang)}
          </summary>
          <div className="flex flex-col gap-3 pt-4">{groups.not_eligible.map(renderItem)}</div>
        </details>
      ) : null}
      <p className="text-base leading-[26px] text-ink-2">{t("results.decision", lang)}</p>
    </div>
  );
}
