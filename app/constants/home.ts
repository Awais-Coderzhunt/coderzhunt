export const siteName = {
  prefix: "Coderz",
  suffix: "Hunt",
};

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Technologies", href: "/technologies" },
  { label: "Contact Us", href: "/contact" },
];

export const headerCta = {
  label: "Schedule Call Now",
  href: "#schedule",
};

export const heroContent = {
  badge: "WE BUILD DIGITAL EXCELLENCE",
  titleStart: "Custom Software Solutions That Drive",
  titleAccent: "Real Results",
  subtitle:
    "CoderzHunt builds scalable, high-performance software solutions that help businesses automate, innovate, and grow confidently.",
  primaryCta: { label: "Schedule Call Now", href: "#schedule" },
  secondaryCta: { label: "Explore Our Work", href: "#portfolio" },
};

export type StatIconName = "briefcase" | "users" | "award" | "headset";

export type HeroStat = {
  value: string;
  label: string;
  icon: StatIconName;
};

export const heroStats: HeroStat[] = [
  { value: "150+", label: "Projects Delivered", icon: "briefcase" },
  { value: "100+", label: "Happy Clients", icon: "users" },
  { value: "5+", label: "Years of Experience", icon: "award" },
  { value: "24/7", label: "Support Available", icon: "headset" },
];
