export const PROFILE = {
  name: "Aawaiz Soomro",
  firstName: "Aawaiz",
  lastName: "Soomro",
  location: "Karachi, PK",
  email: "Aawaizsoomro502@gmail.com",
  email2: "i220845@nu.edu.pk",
  phone: "+92 342 77 66 777",
  role: "Backend and AI engineer.",
  headline: "I build systems that match, rank and scale.",
  bio: "CS student at NUCES-FAST, working across backend, cloud and applied AI: recommendation systems, vision models, and the databases underneath them.",
  offline: "Off the clock: gaming, football, music, and the occasional gym session.",
  status: ["fyp.", "vector search.", "finals.", "everything AI."],
  resumeUrl: "resume.pdf",
  social: {
    github: "https://github.com/aawaiz-soomro",
    linkedin: "https://www.linkedin.com/in/aawaiz-soomro/",
    instagram: "https://www.instagram.com/aawaizsoomro/",
  },
};

/** Sections on the home page, in order. Used by the nav and command palette. */
export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
] as const;

export const withBase = (path?: string) =>
  path ? `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}` : undefined;
