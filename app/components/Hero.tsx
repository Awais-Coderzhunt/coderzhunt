"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { heroContent } from "../constants/home";
import Container from "./Container";

const TechStackScene = dynamic(() => import("./design/TechStackScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-white">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
        Building scene…
      </div>
    </div>
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

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-160 w-160 rounded-full bg-brand-soft opacity-70 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-120 w-120 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <Container className="flex min-h-[calc(100vh-80px)] flex-col py-14 lg:py-20">
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
            className="relative order-1 h-90 overflow-hidden rounded-3xl sm:h-115 lg:order-2 lg:h-150"
          >
            <TechStackScene />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
