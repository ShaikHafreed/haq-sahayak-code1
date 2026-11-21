import en from "../../messages/en.json";
import te from "../../messages/te.json";
import ta from "../../messages/ta.json";

export type Lang = "te" | "en" | "ta";
export type Dictionary = Record<string, string>;

export const DEFAULT_LANG: Lang = "te";
export const LANGS: Lang[] = ["te", "en"]; // ta hidden until filled

const dictionaries: Record<Lang, Dictionary> = { te, en, ta };

export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  const own = dictionaries[lang]?.[key];
  if (typeof own === "string" && own !== "") return own;
  const fallback = dictionaries.en[key];
  if (typeof fallback === "string" && fallback !== "") return fallback;
  return key;
}
