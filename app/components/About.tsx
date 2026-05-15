"use client";

import { motion, type Variants } from "framer-motion";
import {
  aboutContent,
  aboutFeatures,
  type AboutIconName,
} from "../constants/about";
import Container from "./Container";

function TargetIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M2 9h20" />
      <path d="M12 3 8 9l4 12 4-12-4-6z" />
    </svg>
  );
}

const ABOUT_ICONS: Record<AboutIconName, React.ComponentType> = {
  target: TargetIcon,
  eye: EyeIcon,
  gem: GemIcon,
};

const container: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-120 w-120 rounded-full bg-brand-soft opacity-70 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-120 w-120 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={item}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                {aboutContent.eyebrow}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="h-px w-12 bg-brand" />
            </motion.div>

            <motion.h2
              variants={item}
              className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
            >
              {aboutContent.titleStart}{" "}
              <span className="bg-linear-to-r from-brand to-brand-light bg-clip-text text-transparent">
                {aboutContent.titleAccent}
              </span>
            </motion.h2>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg"
            >
              {aboutContent.description}
            </motion.p>

            <motion.ul
              variants={item}
              className="mt-10 space-y-6"
            >
              {aboutFeatures.map((feature) => {
                const Icon = ABOUT_ICONS[feature.icon];
                return (
                  <li key={feature.title} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand-soft text-brand">
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 h-90 overflow-hidden rounded-3xl sm:h-115 lg:order-2 lg:h-130"
          >
            <div className="absolute inset-0 grid place-items-center bg-brand-soft">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                About scene placeholder
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
