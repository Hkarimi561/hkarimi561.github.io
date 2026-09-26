"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface Capability {
  index: string;
  title: string;
  sentence: string;
  techRow?: string[];
}

const CAPABILITIES: Capability[] = [
  {
    index: "01",
    title: "Backend systems.",
    sentence:
      "APIs, data models, and services built to stay fast and predictable under real load.",
    techRow: ["NODE", "POSTGRES", "REDIS"],
  },
  {
    index: "02",
    title: "Product interfaces.",
    sentence:
      "Accessible, responsive front-ends where the details people touch feel right.",
    techRow: ["REACT", "TYPESCRIPT", "TAILWIND"],
  },
  {
    index: "03",
    title: "Reliability & performance.",
    sentence:
      "Observability, testing, and profiling so things keep working after launch.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatIDo() {
  const reducedMotion = usePrefersReducedMotion();

  const hidden = { opacity: 0, y: 16 };
  const visible = { opacity: 1, y: 0 };

  return (
    <section id="what-i-do" aria-labelledby="what-i-do-heading">
      <div className="mx-auto max-w-[1200px] border-t border-border px-6 py-16 md:px-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-32">
        <motion.div
          data-reveal
          className="flex flex-col gap-4 lg:col-span-4"
          initial={hidden}
          whileInView={visible}
          viewport={{ once: true, amount: 0.15 }}
          transition={
            reducedMotion
              ? { duration: 0, delay: 0 }
              : { duration: 0.5, ease: EASE }
          }
        >
          <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong">
            What I do
          </p>
          <h2
            id="what-i-do-heading"
            className="font-display text-h2 font-semibold leading-[1.2] text-text-primary lg:text-h2-lg"
          >
            Full-stack, end to end.
          </h2>
        </motion.div>

        <ol role="list" className="mt-12 flex flex-col lg:col-span-8 lg:mt-0">
          {CAPABILITIES.map((capability, i) => (
            <motion.li
              key={capability.index}
              data-reveal
              className="flex flex-col gap-2 border-t border-border py-6 first:border-t-0 md:flex-row md:gap-6 lg:py-8"
              initial={hidden}
              whileInView={visible}
              viewport={{ once: true, amount: 0.15 }}
              transition={
                reducedMotion
                  ? { duration: 0, delay: 0 }
                  : { duration: 0.5, ease: EASE, delay: (i + 1) * 0.08 }
              }
            >
              <span
                aria-hidden="true"
                className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong md:w-16 md:shrink-0"
              >
                {capability.index}
              </span>
              <div className="flex max-w-[60ch] flex-col gap-3">
                <h3 className="font-display text-h3 font-medium text-text-primary lg:text-h3-lg">
                  {capability.title}
                </h3>
                <p className="text-body leading-[1.6] text-text-secondary">
                  {capability.sentence}
                </p>
                {capability.techRow && (
                  <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                    {capability.techRow.join(" / ")}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
