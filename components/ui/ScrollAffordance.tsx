"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * "SCROLL" mono-label + thin animated line, anchored bottom-left of the
 * hero. Fades out once the user has scrolled past ~10% of viewport height
 * (design/home.md, Layout > Desktop). The traveling dot only animates when
 * motion isn't reduced; the line and label are always static otherwise.
 */
export function ScrollAffordance() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, (value) => {
    const fadeDistance = typeof window !== "undefined" ? window.innerHeight * 0.1 : 80;
    return 1 - Math.min(Math.max(value / fadeDistance, 0), 1);
  });
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute bottom-8 left-6 hidden flex-col items-start gap-2 lg:flex lg:left-8"
      style={{ opacity }}
    >
      <span className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
        Scroll
      </span>
      <span className="relative h-10 w-px overflow-hidden bg-border">
        {!reducedMotion && (
          <motion.span
            className="absolute left-0 top-0 h-3 w-px bg-accent"
            animate={{ y: [0, 28, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </span>
    </motion.div>
  );
}
