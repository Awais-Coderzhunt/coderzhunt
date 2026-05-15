"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { headerCta, navItems, siteName } from "../constants/home";

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
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

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
        scrolled
          ? "top-1 w-[90%] rounded-2xl border border-gray-200 bg-white/85 shadow-lg shadow-black/5 backdrop-blur-md"
          : "top-0 w-full border border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-6 py-4 transition-all duration-300 ${
          scrolled ? "max-w-7xl px-5 lg:px-8" : "max-w-7xl px-6 lg:px-10"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-bold tracking-tight"
        >
          <span className="text-gray-900">{siteName.prefix}</span>
          <span className="text-brand">{siteName.suffix}</span>
          <span className="ml-1 text-gray-300 font-normal">{"</>"}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href={headerCta.href}
          className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
        >
          {headerCta.label}
          <span className="transition-transform group-hover:translate-x-0.5">
            <ArrowIcon />
          </span>
        </Link>
      </div>
    </motion.header>
  );
}
