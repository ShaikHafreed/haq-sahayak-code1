import { getSchemes } from "../../lib/data";

// Fixed scheme for the sample card, so the landing page never shifts with data order.
const SAMPLE_SCHEME_ID = "ap-pms-rtf";

export default function SampleResultCard() {
  const scheme = getSchemes().find((s) => s.id === SAMPLE_SCHEME_ID);
  if (!scheme) return null;
  const reasons = scheme.rules.slice(0, 3);

  return (
    <div className="relative pb-2.5 pr-2.5">
      <div
        aria-hidden="true"
        className="absolute left-2.5 top-2.5 h-[calc(100%-10px)] w-[calc(100%-10px)] bg-marigold-soft"
      />
      <article className="relative border border-navy bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-2">
            Sample result 01
          </p>
          <span className="rounded-full bg-sage-2 px-3 py-1 text-xs font-semibold text-teal-deeper">
            Likely eligible
          </span>
        </div>

        <h2 className="landing-display mt-4 text-2xl leading-8 text-navy">{scheme.name.en}</h2>

        <ul className="mt-4 flex flex-col gap-2.5">
          {reasons.map((rule) => (
            <li key={rule.label.en} className="flex gap-2.5 text-[15px] leading-6 text-ink">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-1 h-4 w-4 shrink-0 text-teal"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <span>{rule.label.en}</span>
            </li>
          ))}
        </ul>

        <div className="landing-mono mt-5 flex flex-col gap-1 border-t border-rule pt-4 text-xs text-ink-2">
          <p className="break-all">Source: {scheme.sourceUrl}</p>
          <p>Checked: {scheme.lastVerified ?? "not recorded"}</p>
        </div>

        <p className="mt-4 text-xs text-ink-2">
          Shown for Sample Lakshmi, a made-up student. Not a real person.
        </p>
      </article>
    </div>
  );
}
