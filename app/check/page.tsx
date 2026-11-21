"use client";

import { Suspense } from "react";
import Wizard from "../../components/check/Wizard";

export default function CheckPage() {
  return (
    <Suspense fallback={null}>
      <Wizard />
    </Suspense>
  );
}
