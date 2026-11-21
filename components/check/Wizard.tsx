"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { t } from "../../lib/i18n";
import { useLang } from "../../lib/i18n/LangProvider";
import { lakshmi, ravi, saroja } from "../../lib/engine/personas";
import { clearProfile, loadProfile, saveProfile } from "../../lib/storage/profile";
import type { Profile } from "../../lib/types";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import { ALL_QUESTION_KEYS, visibleQuestions, type QuestionKey } from "./visibleQuestions";

const PERSONAS = new Map<string, Profile>([
  ["lakshmi", lakshmi],
  ["ravi", ravi],
  ["saroja", saroja],
]);

type Value = string | number | boolean;
type RawOption = { value: Value; labelKey?: string };
type RawDef = {
  titleKey: string;
  whyKey?: string;
  explanationKey?: string;
  options: RawOption[];
};

const opts = (values: string[]): RawOption[] =>
  values.map((v) => ({ value: v, labelKey: `check.opt.${v}` }));
const YES_NO: RawOption[] = [
  { value: true, labelKey: "check.opt.yes" },
  { value: false, labelKey: "check.opt.no" },
];

const DEFS: Record<QuestionKey, RawDef> = {
  stage: {
    titleKey: "check.q.stage",
    whyKey: "check.q.stage.why",
    options: opts(["class1to8", "class9to10", "inter", "iti", "diploma", "ug", "pg", "professional"]),
  },
  category: {
    titleKey: "check.q.category",
    whyKey: "check.q.category.why",
    options: opts(["SC", "ST", "BC", "EBC", "Kapu", "Minority", "OC"]),
  },
  gender: { titleKey: "check.q.gender", options: opts(["female", "male", "other"]) },
  disability: {
    titleKey: "check.q.disability",
    whyKey: "check.q.disability.why",
    options: YES_NO,
  },
  incomeBand: {
    titleKey: "check.q.incomeBand",
    whyKey: "check.q.incomeBand.why",
    options: opts(["lt1L", "1to2_5L", "2_5to4_5L", "gt4_5L"]),
  },
  familyAssetRulesOk: {
    titleKey: "check.q.asset",
    explanationKey: "check.q.asset.explanation",
    whyKey: "check.q.asset.why",
    options: YES_NO,
  },
  childrenInClass1to12: {
    titleKey: "check.q.children",
    whyKey: "check.q.children.why",
    options: [0, 1, 2, 3, 4].map((v) => ({ value: v, labelKey: v === 4 ? "check.opt.gte4" : `check.opt.n${v}` })),
  },
  girlsInFamilyOnPragati: {
    titleKey: "check.q.girls",
    whyKey: "check.q.girls.why",
    options: [1, 2, 3].map((v) => ({ value: v, labelKey: v === 3 ? "check.opt.gte3" : `check.opt.g${v}` })),
  },
  residence: { titleKey: "check.q.residence", options: opts(["day", "hostel"]) },
  collegeType: {
    titleKey: "check.q.collegeType",
    whyKey: "check.q.collegeType.why",
    options: opts(["affiliated", "private_or_deemed_university", "distance"]),
  },
  admissionQuota: {
    titleKey: "check.q.admissionQuota",
    options: opts(["convener", "management_or_spot"]),
  },
  attendance75: { titleKey: "check.q.attendance75", options: YES_NO },
  class12Top20Percent: { titleKey: "check.q.class12Top20", options: YES_NO },
  aicteApproved: { titleKey: "check.q.aicte", options: YES_NO },
};

export default function Wizard() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  const prefill = persona ? PERSONAS.get(persona) : undefined;

  const [profile, setProfile] = useState<Profile>({});
  const [step, setStep] = useState(0);
  const [isSample, setIsSample] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefill) {
      const copy: Profile = { ...prefill };
      saveProfile(copy);
      setProfile(copy);
      setIsSample(true);
    } else {
      setProfile(loadProfile());
    }
    setStep(0);
    setReady(true);
  }, [prefill]);

  const visible = visibleQuestions(profile);
  const key: QuestionKey | undefined = visible[step];
  const def = key ? DEFS[key] : undefined;

  // Save the new answer, drop answers to questions that are now hidden, then move on.
  function applyChange(next: Profile, nextStep: number) {
    const keep = new Set(visibleQuestions(next));
    const pruned: Profile = { ...next };
    for (const k of ALL_QUESTION_KEYS) {
      if (!keep.has(k)) delete pruned[k];
    }
    setProfile(pruned);
    saveProfile(pruned);
    setStep(Math.min(nextStep, visibleQuestions(pruned).length));
  }

  function choose(k: QuestionKey, value: Value) {
    applyChange({ ...profile, [k]: value } as Profile, step + 1);
  }

  function skip(k: QuestionKey) {
    const next: Profile = { ...profile };
    delete next[k];
    applyChange(next, step + 1);
  }

  function goBack() {
    setStep(Math.max(0, Math.min(step, visible.length) - 1));
  }

  function clearAll() {
    clearProfile();
    setProfile({});
    setStep(0);
    setIsSample(false);
  }

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-5 py-6">
      {isSample ? (
        <span className="self-start rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
          {t("check.sampleBadge", lang)}
        </span>
      ) : null}
      <h1 className="text-2xl font-bold text-slate-900">{t("check.title", lang)}</h1>
      <p className="text-base text-slate-600">{t("check.intro", lang)}</p>
      <ProgressBar current={Math.min(step, visible.length)} total={visible.length} />

      {key && def ? (
        <QuestionCard
          title={t(def.titleKey, lang)}
          why={def.whyKey ? t(def.whyKey, lang) : undefined}
          explanation={def.explanationKey ? t(def.explanationKey, lang) : undefined}
          options={def.options.map((o) => ({
            value: o.value,
            label: o.labelKey ? t(o.labelKey, lang) : String(o.value),
          }))}
          selected={profile[key] as Value | undefined}
          onSelect={(v) => choose(key, v)}
          onNotSure={() => skip(key)}
        />
      ) : (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">{t("check.finalTitle", lang)}</h2>
          <p className="text-base text-slate-700">{t("check.finalNote", lang)}</p>
          <Link
            href="/results"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0F766E] px-5 py-3 text-base font-semibold text-white"
          >
            {t("check.seeSchemes", lang)}
          </Link>
        </section>
      )}

      <div className="flex flex-col gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 px-4 py-3 text-base font-semibold text-slate-800"
          >
            {t("check.back", lang)}
          </button>
        ) : null}
        <button
          type="button"
          onClick={clearAll}
          className="min-h-[44px] min-w-[44px] text-base text-slate-600 underline"
        >
          {t("check.clearData", lang)}
        </button>
      </div>
    </div>
  );
}
