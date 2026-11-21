import { describe, it, expect } from "vitest";
import { t } from "../lib/i18n";

describe("t()", () => {
  it("returns English text, falls back to en for empty ta, and returns unknown keys as-is", () => {
    expect(t("app.name", "en")).toBe("Haq Sahayak");
    expect(t("app.name", "ta")).toBe("Haq Sahayak");
    expect(t("no.such.key", "en")).toBe("no.such.key");
  });
});
