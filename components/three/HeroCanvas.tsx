"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import IcosahedronMesh from "./IcosahedronMesh";

interface HeroCanvasProps {
  containerRef: React.RefObject<HTMLElement | null>;
  accentColor: string;
  /** Page background color for the current theme — used as the
   * hemisphere light's "ground" color so the mesh's shadowed side reads
   * as sitting in the same void as the page in both themes. */
  bgColor: string;
}

/**
 * The real WebGL scene. Only ever mounted client-side (via next/dynamic,
 * ssr: false) and only in the "full" motion mode — see lib/use-hero-motion-mode.ts.
 */
export default function HeroCanvas({ containerRef, accentColor, bgColor }: HeroCanvasProps) {
  const scrollProgress = useRef(0);
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  // This component only ever mounts client-side (parent loads it via
  // next/dynamic with ssr: false), so `window` is safe to read here.
  const [dpr] = useState(() => Math.min(window.devicePixelRatio || 1, 2));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollProgress = () => {
      const rect = el.getBoundingClientRect();
      // Absolute document-space position of the hero's top edge. `rect.top`
      // shrinks by exactly as much as `window.scrollY` grows while
      // scrolling, so this sum stays constant regardless of scroll
      // position.
      const heroDocTop = rect.top + window.scrollY;
      const maxScrollableDistance = Math.max(
        document.documentElement.scrollHeight - window.innerHeight - heroDocTop,
        0
      );
      // The recede must fully complete (progress reaches 1) by the time the
      // user has scrolled as far as the page allows, which — now that a
      // second section sits below the hero — can be shorter than the
      // hero's own height. Map progress over whichever distance is
      // shorter.
      const distance = Math.min(rect.height, maxScrollableDistance || rect.height);
      // 0 while the hero's top is at/below the viewport top; 1 once the
      // hero has scrolled `distance` past the top of the viewport.
      const progress = distance > 0 ? -rect.top / distance : 0;
      scrollProgress.current = Math.min(Math.max(progress, 0), 1);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [containerRef]);

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 37 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#8ea0ad", bgColor, 0.45]} />
      {/* Key light: soft, warm-neutral, upper-left */}
      <directionalLight position={[-4, 4, 3]} intensity={1.1} color="#fff3e0" />
      {/* Dim accent-teal rim/fill light from behind the object */}
      <pointLight position={[1.5, -0.5, -3]} intensity={0.9} color={accentColor} />
      <IcosahedronMesh
        scrollProgress={scrollProgress}
        isCoarsePointer={isCoarsePointer}
        accentColor={accentColor}
      />
    </Canvas>
  );
}
