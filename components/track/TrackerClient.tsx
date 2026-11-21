"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import { daysRemaining, loadTracker, saveTracker } from "@/lib/storage/tracker";
import type { Bilingual, Scheme, TrackedApplication } from "@/lib/types";

type Props = { schemes: Scheme[] };
type Status = TrackedApplication["status"];

const STATUSES: Status[] = ["not_started", "applied", "approved", "rejected"];
const FIELD =
  "min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900";
const SELECT_FIELD =
  "min-h-[48px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900";
const pick = (b: Bilingual, lang: Lang) => b[lang] || b.en;

export default function TrackerClient({ schemes }: Props) {
  const { lang } = useLang();
  // Read storage once on mount; this component only renders after the profile has loaded in the browser.
  const [all, setAll] = useState<Record<string, TrackedApplication>>(() => loadTracker());

  const update = (scheme: Scheme, patch: Partial<TrackedApplication>) => {
    const current: TrackedApplication = all[scheme.id] ?? {
      schemeId: scheme.id,
      status: "not_started",
    };
    const next: TrackedApplication = { ...current, ...patch };
    saveTracker(next);
    setAll((prev) => ({ ...prev, [scheme.id]: next }));
  };

  return (
    <div className="flex flex-col gap-6">
      {schemes.map((scheme) => {
        const entry: TrackedApplication = all[scheme.id] ?? {
          schemeId: scheme.id,
          status: "not_started",
        };
        const closes = scheme.window.closes;
        const days = closes ? daysRemaining(closes, new Date()) : NaN;
        return (
          <section key={scheme.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-900">{pick(scheme.name, lang)}</h2>
            {Number.isNaN(days) ? null : days < 0 ? (
              <p className="text-base font-semibold text-[var(--color-not-eligible-text)]">{t("track.closed", lang)}</p>
            ) : (
              <p className="text-base font-semibold text-[var(--color-primary)]">
                {days} {t("track.daysLeft", lang)}
              </p>
            )}
            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              {t("track.statusLabel", lang)}
              <select
                className={SELECT_FIELD}
                value={entry.status}
                onChange={(e) => update(scheme, { status: e.target.value as Status })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t("track.status." + s, lang)}
                  </option>
                ))}
              </select>
            </label>
            {entry.status === "applied" ? (
              <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                {t("track.appliedOn", lang)}
                <input
                  type="date"
                  className={FIELD}
                  value={entry.appliedOn ?? ""}
                  onChange={(e) => update(scheme, { appliedOn: e.target.value || undefined })}
                />
              </label>
            ) : null}
            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              {t("track.note", lang)}
              <textarea
                className={FIELD}
                rows={3}
                value={entry.note ?? ""}
                onChange={(e) => update(scheme, { note: e.target.value })}
              />
            </label>
            <p className="text-xs text-slate-600">{t("track.noteHint", lang)}</p>
          </section>
        );
      })}
    </div>
  );
}
