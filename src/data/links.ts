export const PROFILE = {
  name: "Aawaiz Soomro",
  firstName: "Aawaiz",
  lastName: "Soomro",
  location: "Karachi, PK",
  email: "Aawaizsoomro502@gmail.com",
  email2: "i220845@nu.edu.pk",
  phone: "+92 342 77 66 777",
  titles: ["Student", "Dev", "Aspiring AI Engineer"],
  intro: "I’m Aawaiz, a CS student at NUCES-FAST focusing on backend development, cloud, and AI engineering.",
  about: [
    "I’ve worked on projects ranging from recommendation systems and AI models to full-stack apps and database systems.",
    "Outside of tech, I enjoy gaming, football, music, and occasionally hitting the gym.",
    "On this site, you’ll find highlights of my projects and experiences. Feel free to reach out — I’m always open to connecting.",
  ],
  status: ["life.", "fyp.", "finals.", "Everything AI."],
  resumeUrl: "resume.pdf",
  social: {
    github: "https://github.com/aawaiz-soomro",
    linkedin: "https://www.linkedin.com/in/aawaiz-soomro/",
    instagram: "https://www.instagram.com/aawaizsoomro/",
  },
};

/** Sections on the home page, in order. Used by the nav and command palette. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "fyp", label: "FYP" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const withBase = (path?: string) =>
  path ? `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}` : undefined;
