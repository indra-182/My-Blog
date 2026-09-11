import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const records = vi.hoisted(() => ({
  lazyMotion: [] as Array<Record<string, unknown>>,
  motionConfig: [] as Array<Record<string, unknown>>,
}));

vi.mock("motion/react", () => ({
  domMax: "dom-max",
  LazyMotion: ({ children, ...props }: { children: ReactNode }) => {
    records.lazyMotion.push(props);
    return <div data-testid="lazy-motion">{children}</div>;
  },
  MotionConfig: ({ children, ...props }: { children: ReactNode }) => {
    records.motionConfig.push(props);
    return <div data-testid="motion-config">{children}</div>;
  },
}));

import { MotionProvider } from "./motion-provider";

describe("MotionProvider", () => {
  it("loads one runtime with the user reduced-motion policy", () => {
    render(
      <MotionProvider>
        <span>content</span>
      </MotionProvider>,
    );

    expect(records.lazyMotion).toEqual([{ features: "dom-max" }]);
    expect(records.motionConfig).toEqual([{ reducedMotion: "user" }]);
    expect(screen.getByTestId("lazy-motion")).toContainElement(
      screen.getByTestId("motion-config"),
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
