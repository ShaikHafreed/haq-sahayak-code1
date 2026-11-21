"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TrackerClient from "@/components/track/TrackerClient";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/i18n/LangProvider";
import { getSchemes } from "@/lib/data";
import { groupResults } from "@/lib/engine/groupResults";
import { loadProfile } from "@/lib/storage/profile";
import type { Profile, Scheme } from "@/lib/types";

const BUTTON =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0F766E] px-5 py-3 text-base font-semibold text-white";

export default function TrackPage() {
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

  // Same engine call as app/results/page.tsx; only likely and check schemes are tracked.
  const groups = groupResults(profile, getSchemes());
  const schemes: Scheme[] = [...groups.likely, ...groups.check].map((r) => r.scheme);

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("track.title", lang)}</h1>
      {schemes.length === 0 ? (
        <p className="text-base text-slate-700">{t("track.none", lang)}</p>
      ) : (
        <TrackerClient schemes={schemes} />
      )}
    </div>
  );
}
