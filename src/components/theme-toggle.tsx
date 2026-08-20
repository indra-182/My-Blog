"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";

type Theme = "light" | "dark";

function readStoredTheme(): Theme {
  try {
    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // Theme still applies for this session when storage is unavailable.
  }
}

function subscribeToTheme(onChange: () => void) {
  const handleChange = () => {
    applyTheme(readStoredTheme());
    onChange();
  };
  window.addEventListener("storage", handleChange);
  window.addEventListener("themechange", handleChange);
  return () => {
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
  const label = dictionary.theme[active];

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={`${dictionary.theme.label}: ${label}`}
      title={`${dictionary.theme.label}: ${label}`}
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
