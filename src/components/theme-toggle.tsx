"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }
  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme still applies for this session when storage is unavailable.
  }
}

function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const handleChange = () => {
    // An explicit choice always wins over the live system preference.
    applyTheme(readStoredTheme());
    onChange();
  };
  media.addEventListener("change", handleChange);
  window.addEventListener("storage", handleChange);
  window.addEventListener("themechange", handleChange);
  return () => {
    media.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("themechange", handleChange);
  };
}

function getThemeSnapshot(): Theme {
  return readStoredTheme();
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

  const next = active === "dark" ? "light" : "dark";
  const Icon = active === "dark" ? Moon : Sun;
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
      onClick={() => {
        storeTheme(next);
        applyTheme(next);
        window.dispatchEvent(new Event("themechange"));
      }}
    >
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
