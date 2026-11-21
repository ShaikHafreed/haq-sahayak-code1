"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { LANGS, t, type Lang } from "../lib/i18n";
import { useLang } from "../lib/i18n/LangProvider";

const NAME_KEY: Record<string, string> = { te: "lang.name.te", en: "lang.name.en" };
const CODES = LANGS as Lang[];

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rowRefs = useRef<Partial<Record<Lang, HTMLButtonElement | null>>>({});
  const lastPointer = useRef<string>("");
  const focusFirstRow = useRef(false);
  const suppressFocusOpen = useRef(false);

  // Close on outside pointer or Escape while open.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        returnFocus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
    // returnFocus only touches refs, so it is safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && focusFirstRow.current) {
      focusFirstRow.current = false;
      rowRefs.current[lang]?.focus();
    }
  }, [open, lang]);

  function returnFocus() {
    suppressFocusOpen.current = true;
    buttonRef.current?.focus();
    suppressFocusOpen.current = false;
  }

  function select(code: Lang) {
    setLang(code);
    setOpen(false);
    returnFocus();
  }

  function onButtonClick() {
    // Mouse users get the hover-opened menu; the click must not close it again.
    if (lastPointer.current === "mouse") setOpen(true);
    else setOpen((o) => !o);
  }

  function onButtonFocus(e: ReactFocusEvent<HTMLButtonElement>) {
    if (suppressFocusOpen.current) return;
    if (e.target.matches(":focus-visible")) setOpen(true);
  }

  function onButtonKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    lastPointer.current = "";
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (open) rowRefs.current[lang]?.focus();
      else {
        focusFirstRow.current = true;
        setOpen(true);
      }
    }
  }

  function onMenuKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const idx = CODES.findIndex((c) => rowRefs.current[c] === document.activeElement);
    const next =
      e.key === "ArrowDown"
        ? (idx + 1) % CODES.length
        : (idx - 1 + CODES.length) % CODES.length;
    rowRefs.current[CODES[next]]?.focus();
  }

  function onEnter(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") setOpen(true);
  }

  function onLeave(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative" onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onClick={onButtonClick}
        onFocus={onButtonFocus}
        onKeyDown={onButtonKeyDown}
        className="flex h-10 min-w-11 items-center gap-2 rounded border border-navy bg-white px-3 text-sm font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
      >
        <span>{`${t("lang.label", lang)}: ${t(NAME_KEY[lang] ?? "lang.name.en", lang)}`}</span>
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={menuId}
        role="menu"
        aria-label={t("lang.menuTitle", lang)}
        onKeyDown={onMenuKeyDown}
        className={`absolute right-0 top-full z-20 mt-1 w-64 border border-navy bg-white transition-opacity duration-150 motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <p className="px-3 pb-1 pt-3 text-xs font-semibold text-ink-3">{t("lang.menuTitle", lang)}</p>
        {CODES.map((code) => {
          const active = code === lang;
          return (
            <button
              key={code}
              ref={(el) => {
                rowRefs.current[code] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => select(code)}
              className={`flex h-12 w-full items-center justify-between px-3 text-left hover:bg-sage focus-visible:bg-sage focus-visible:outline-none ${
                active ? "bg-paper" : ""
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span className="text-base font-medium text-ink">{t(NAME_KEY[code] ?? "lang.name.en", code)}</span>
                {code === "te" && <span className="text-xs text-ink-3">{t("lang.sub.te", lang)}</span>}
              </span>
              {active && (
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-teal">
                  <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
