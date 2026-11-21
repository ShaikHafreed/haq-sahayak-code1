"use client";

import Link from "next/link";
import type { ReactNode } from "react";

// `sample` is the server-rendered sample result card, passed in from app/page.tsx.
export default function Hero({ sample }: { sample: ReactNode }) {
  return (
    <section className="landing-grid-bg relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[38%] bg-sage-2 md:block"
      />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-5 pb-16 pt-10 md:grid-cols-12 md:gap-x-6 md:px-16 md:pb-24 md:pt-24">
        <div className="flex flex-col items-start gap-5 md:col-span-7">
          <p className="rise rise-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy">
            <span aria-hidden="true" className="h-2 w-2 bg-marigold" />
            Education schemes, Andhra Pradesh
          </p>

          <h1 className="rise rise-2 landing-display text-[40px] leading-[44px] text-navy md:text-[60px] md:leading-[64px]">
            Check which education schemes you can <span className="claim">claim</span>, in minutes.
          </h1>

          <p className="rise rise-3 max-w-[540px] text-[18px] leading-[28px] text-ink-2 md:text-[20px] md:leading-[30px]">
            Answer a few questions about your family and studies. We show which Andhra Pradesh
            education schemes you may qualify for, why, and where to confirm on the official portal.
          </p>

          <div className="rise rise-4 flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center md:gap-6">
            <Link
              href="/check"
              className="btn-fill inline-flex h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-teal px-7 text-base font-semibold text-white md:h-[52px] md:w-auto"
            >
              Check my eligibility
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="btn-fill-arrow h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/check?persona=lakshmi"
              className="text-base font-medium text-teal underline decoration-1 underline-offset-4"
            >
              See a sample result
            </Link>
          </div>

          <p className="rise rise-5 text-sm text-ink-2">
            Every question can be skipped. Your answers stay on this device.
          </p>
        </div>

        <div className="md:col-span-5 md:col-start-8 md:row-start-1">{sample}</div>
      </div>
    </section>
  );
}
