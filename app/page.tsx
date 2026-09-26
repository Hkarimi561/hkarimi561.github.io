import Link from "next/link";
import { HeroVisual } from "@/components/three/HeroVisual";
import { ScrollAffordance } from "@/components/ui/ScrollAffordance";
import { WhatIDo } from "@/components/ui/WhatIDo";

export default function Home() {
  return (
    <main>
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Text zone — respects the container measure even at lg+, where the
            visual zone (below) is intentionally full-bleed to the viewport
            edge. See design/home.md, Layout > Desktop. */}
        <div
          className="flex w-full flex-col justify-center gap-6 px-6 py-24 md:px-8 md:py-28 lg:w-[45%] lg:shrink-0 lg:py-32 lg:pr-12 lg:[padding-left:max(2rem,calc((100vw-1200px)/2+2rem))]"
        >
          <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong lg:text-mono-label-lg">
            Software Engineer
          </p>

          <h1 className="font-display text-h1 font-semibold leading-[1.1] text-text-primary md:text-display md:leading-[1.05] lg:text-display-lg">
            Hamid Karimi
          </h1>

          <p className="max-w-[36ch] text-body leading-[1.6] text-text-secondary lg:text-body-lg">
            I build fast, reliable full-stack products — from backend
            systems to the pixels people touch.
          </p>

          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
            <Link
              href="/projects"
              className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-body font-medium text-on-accent transition-colors hover:bg-accent-strong sm:w-auto"
            >
              View projects
            </Link>
            <Link
              href="/articles"
              className="text-body text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
            >
              Read articles
            </Link>
          </div>
        </div>

        {/* 3D zone — full-bleed to the viewport's right edge on desktop;
            contained, fixed-aspect, and last in DOM order below lg. */}
        <div className="w-full px-6 pb-16 md:px-8 lg:w-[55%] lg:px-0 lg:pb-0">
          <div className="mx-auto max-w-[420px] md:max-w-none lg:h-full">
            <HeroVisual />
          </div>
        </div>

        <ScrollAffordance />
      </section>

      <WhatIDo />
    </main>
  );
}
