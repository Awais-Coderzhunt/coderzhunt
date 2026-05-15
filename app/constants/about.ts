export const aboutContent = {
  eyebrow: "ABOUT US",
  titleStart: "We're More Than",
  titleAccent: "a Software Company",
  description:
    "CoderzHunt is a team of passionate developers, designers, and problem solvers who love turning ideas into powerful digital solutions. We build scalable, secure, and high-performance software that helps businesses grow and stay ahead.",
};

export type AboutIconName = "target" | "eye" | "gem";

export type AboutFeature = {
  title: string;
  description: string;
  icon: AboutIconName;
};

export const aboutFeatures: AboutFeature[] = [
  {
    title: "Our Mission",
    description:
      "To deliver innovative software solutions that empower businesses to achieve their goals.",
    icon: "target",
  },
  {
    title: "Our Vision",
    description:
      "To be a global leader in custom software development and digital transformation.",
    icon: "eye",
  },
  {
    title: "Our Values",
    description:
      "Quality, Transparency, Innovation, and Customer Success are at the heart of everything we do.",
    icon: "gem",
  },
];
