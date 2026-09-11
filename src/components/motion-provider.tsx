"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

/**
 * One Motion runtime for the app. Interactive islands opt into the `m` API,
 * while the surrounding page and MDX remain Server Components.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
