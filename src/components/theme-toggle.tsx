"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({ dictionary }: { dictionary: Dictionary }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const active = resolvedTheme === "dark" ? "dark" : "light";
  const next = active === "dark" ? "light" : "dark";
  const Icon = active === "dark" ? LuMoon : LuSun;
  const label = dictionary.theme[active];

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={
        mounted ? `${dictionary.theme.label}: ${label}` : dictionary.theme.label
      }
      title={
        mounted ? `${dictionary.theme.label}: ${label}` : dictionary.theme.label
      }
      onClick={() => setTheme(next)}
    >
      {mounted ? <Icon size={18} strokeWidth={1.8} aria-hidden="true" /> : null}
    </button>
  );
}
