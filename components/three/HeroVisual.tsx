"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useHeroMotionMode } from "@/lib/use-hero-motion-mode";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const DARK_ACCENT = "#5EEAD4";

/**
 * Renders either the real @react-three/fiber scene or its static fallback,
 * per design/home.md section 5. The canvas is never mounted when
 * prefers-reduced-motion is set; while the device/motion check is still
 * resolving on first client render, the static image is shown so there is
 * no flash of WebGL content.
 */
export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mode = useHeroMotionMode();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Manual scroll-progress tracking (rather than framer's `useScroll`
  // target/offset, which maps 0→1 over the container's own height): the
  // recede must reach 1 by the time the user has scrolled as far as the
  // page allows, which can be shorter than the container's height once
  // more sections sit below the hero. See HeroCanvas.tsx for the same fix
  // applied to the WebGL path.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollProgress = () => {
      const rect = el.getBoundingClientRect();
      const heroDocTop = rect.top + window.scrollY;
      const maxScrollableDistance = Math.max(
        document.documentElement.scrollHeight - window.innerHeight - heroDocTop,
        0
      );
      const distance = Math.min(rect.height, maxScrollableDistance || rect.height);
      const progress = distance > 0 ? -rect.top / distance : 0;
      scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [scrollYProgress]);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "low-end" || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    // Cheap 2D CSS parallax tilt, no WebGL — the low-end path's "whisper of
    // interactivity" called out in design/home.md section 5.
    setTilt({ x: relativeY * -8, y: relativeX * 8 });
  };

  const handlePointerLeave = () => {
    if (mode === "low-end") setTilt({ x: 0, y: 0 });
  };

  const showCanvas = mode === "full";
  // Covers "loading" too, so the static image is what's on screen until the
  // reduced-motion / low-end check resolves on the client.
  const showStatic = !showCanvas;
  // Only the low-end path gets the scroll recede transition on the static
  // image; "loading" and "reduced" show it at a fixed opacity/scale.
  const applyScrollMotion = mode === "low-end";

  return (
    <div
      ref={containerRef}
      className="relative aspect-square max-h-[50vh] w-full md:aspect-[4/3] md:max-h-[60vh] lg:aspect-auto lg:h-full lg:max-h-none"
    >
      {showCanvas && (
        <div className="absolute inset-0" tabIndex={-1} aria-hidden="true">
          <HeroCanvas containerRef={containerRef} accentColor={DARK_ACCENT} />
        </div>
      )}

      {showStatic && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={applyScrollMotion ? { scale, opacity } : undefined}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <Image
            src="/hero-fallback.svg"
            alt=""
            aria-hidden="true"
            width={1200}
            height={1200}
            priority
            className="h-full w-full max-w-[560px] object-contain transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          />
        </motion.div>
      )}
    </div>
  );
}
