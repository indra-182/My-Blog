"use client";

import { m, useReducedMotion } from "motion/react";
import { useHydrated } from "@/components/use-hydrated";

const routePath = "M25 146 C74 140 62 46 129 68 S189 158 228 86 S274 49 296 26";

export function AtlasRoutePath() {
  const reducedMotion = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = hydrated && reducedMotion === true;
  const animate = hydrated && !reduce;

  return (
    <m.svg
      className="atlas-route-path"
      viewBox="0 0 320 180"
      role="presentation"
      aria-hidden="true"
      data-motion-state={
        hydrated ? (reduce ? "reduced" : "animated") : "static"
      }
      initial={false}
      animate={animate ? { opacity: 1 } : false}
      transition={{ duration: reduce ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      {hydrated ? (
        <m.path
          d={routePath}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <path d={routePath} />
      )}
      {hydrated ? (
        <>
          <m.circle
            cx="25"
            cy="146"
            r="5"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduce ? 0 : 0.26,
              delay: reduce ? 0 : 0.5,
            }}
          />
          <m.circle
            cx="296"
            cy="26"
            r="5"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduce ? 0 : 0.26,
              delay: reduce ? 0 : 0.5,
            }}
          />
        </>
      ) : (
        <>
          <circle cx="25" cy="146" r="5" />
          <circle cx="296" cy="26" r="5" />
        </>
      )}
    </m.svg>
  );
}
