"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function readSystemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function readActiveTheme(): Theme {
  return readStoredTheme() ?? readSystemTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The explicit choice still applies for this session.
  }
}

function subscribeToTheme(onChange: () => void) {
  const handleChange = () => {
    applyTheme(readActiveTheme());
    onChange();
  };
  window.addEventListener("storage", handleChange);
  window.addEventListener("themechange", handleChange);
  const media =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: light)")
      : null;
  media?.addEventListener?.("change", handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("themechange", handleChange);
    media?.removeEventListener?.("change", handleChange);
  };
}

function getThemeSnapshot(): Theme {
  return readActiveTheme();
}

function getServerTheme(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const active = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerTheme,
  );

  useEffect(() => {
    applyTheme(active);
  }, [active]);

  const next = active === "dark" ? "light" : "dark";
  const label =
    next === "light"
      ? dictionary.theme.switchToLight
      : dictionary.theme.switchToDark;

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      title={label}
      data-theme-toggle
      onClick={() => {
        storeTheme(next);
        applyTheme(next);
        window.dispatchEvent(new Event("themechange"));
      }}
    >
      <Sun
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
        data-theme-icon="light"
      />
      <Moon
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
        data-theme-icon="dark"
      />
    </button>
  );
}
