export type Experience = {
  role: string;
  org: string;
  date: string;
  details: string[];
  skills?: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    role: "Student Teaching Assistant",
    org: "National University of Computer and Emerging Sciences",
    date: "Oct 2025 - Present",
    details: [
      "Evaluate student assessments and provide academic support to enhance their learning experience in Data Structures."
    ],
    skills: ["Assistant Teaching", "Data Structures"]
  },
  {
    role: "IT Intern",
    org: "TAJS SKYLINE",
    date: "Jun 2025 - Aug 2025",
    details: [
      "Assisted the technical team in cloud computing and AI technology projects, enhancing IT operations.",
      "Contributed to research initiatives that explored innovative solutions in modern computing systems.",
      "Developed problem-solving skills through hands-on experience and collaboration with experienced professionals.",
      "Recognized by mentors for strong work ethic and technical proficiency during the internship."
    ],
    skills: ["Cloud Computing", "Artificial Intelligence (AI)"]
  },
  {
    role: "Web Developer",
    org: "MediaByte",
    date: "Jun 2020 - Aug 2022",
    details: [
      "Developed over 20 websites utilizing WordPress, PHP, HTML, CSS, and JavaScript.",
      "Implemented effective SEO strategies to enhance website visibility and improve traffic.",
      "Optimized website performance and security to ensure a seamless user experience.",
      "Contributed to MediaByte's growth as a dynamic startup in the digital media landscape."
    ],
    skills: ["PHP", "Virtual Private Server (VPS)"]
  }
];
