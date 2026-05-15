"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import {
  heroContent,
  heroStats,
  type StatIconName,
} from "../constants/home";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-3xl bg-brand-soft/50" />
  ),
});

const container: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6L12 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function BriefcaseIcon() {
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
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function UsersIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AwardIcon() {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function HeadsetIcon() {
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
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

const STAT_ICONS: Record<StatIconName, React.ComponentType> = {
  briefcase: BriefcaseIcon,
  users: UsersIcon,
  award: AwardIcon,
  headset: HeadsetIcon,
};

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-160 w-160 rounded-full bg-brand-soft blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-20 h-120 w-120 rounded-full bg-brand/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ff6b1a 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <motion.div
            variants={container}
            initial="initial"
            animate="animate"
            className="order-2 lg:order-1"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-brand">
                <SparkleIcon />
                {heroContent.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {heroContent.titleStart}{" "}
              <span className="bg-linear-to-r from-brand to-brand-light bg-clip-text text-transparent">
                {heroContent.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg"
            >
              {heroContent.subtitle}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={heroContent.primaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand/30 transition-colors hover:bg-brand-dark"
                >
                  {heroContent.primaryCta.label}
                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={heroContent.secondaryCta.href}
                  className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  {heroContent.secondaryCta.label}
                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 h-90 sm:h-115 lg:order-2 lg:h-150"
          >
            <HeroScene />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full rounded-2xl border border-brand/15 bg-linear-to-br from-brand-soft via-white to-brand-soft/60 px-4 py-5 shadow-sm sm:px-6 sm:py-6 lg:mt-16"
        >
          <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-brand/15">
            {heroStats.map((stat) => {
              const Icon = STAT_ICONS[stat.icon];
              return (
                <li
                  key={stat.label}
                  className="flex items-center gap-4 px-3 sm:px-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-brand">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
