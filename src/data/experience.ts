export type Experience = {
  role: string;
  org: string;
  date: string;
  details: string[];
};

export const EXPERIENCES: Experience[] = [
  // {
  //   role: "Robotics Research Intern",
  //   org: "GE Vernova Advanced Research Center",
  //   date: "May 2026 – Aug 2026",
  //   details: [ ]
  // },
  {
    role: "Graduate Research Assistant",
    org: "Contextual Computing Group @ Georgia Tech",
    date: "Aug 2024 – Present",
    details: [
      "Conducted field robotics research in collaboration with Georgia Aquarium and the Wild Dolphin Project nonprofit, contributing to real-time dolphin communication research initiatives and enrichment for captive cetaceans",
      "Engineered a custom bone-conduction headset for underwater use by researchers, enabling clear audio playback for real-time dolphin vocalization translation and two-way communication between researchers and dolphins",
      "Developed and optimized tools for dolphin vocalization analysis using autocorrelation, waveform reconstruction, and spectrogram visualization in Python, enabling researchers to accurately mimic essential sounds for testing",
      "Co-authored research papers documenting system design and field findings for submission to international conferences in animal-computer interaction and marine robotics"
    ]
  },
  {
    role: "Graduate Teaching Assistant",
    org: "Georgia Institute of Technology",
    date: "May 2025 – Present",
    details: [
      "Served as a teaching assistant for Mobile and Ubiquitous Computing and Prototyping Intelligent Devices; graduate-level, project based courses on embedded systems, firmware development, and edge machine learning",
      "Guided 6–8 student teams in developing mobile-based prototypes and custom microcontroller projects, providing mentorship on report authorship that contributed to higher project success rates and more polished deliverables",
      "Hosted office hours and asynchronous feedback sessions, guiding students through technical and research hurdles"
    ]
  },
  {
    role: "Technical Support Agent (Student Lead)",
    org: "Georgia Tech Office of Information Technology",
    date: "May 2024 – Jan 2025",
    details: [
      "Responded to triaged security incidents and lead a team of 12 agents to proficiency for support to over 30 departments of Georgia Tech personnel via remote and on-site assistance",
      "Developed and deployed a PowerShell script for verifying device imaging and task sequences that reduced setup time for our team by 50% in most cases",
      "Migrated enterprise device management from the SCCM platform to Microsoft Endpoint/Intune, enabling more streamlined deployment of over 15 distinct user profiles with associated software and service access",
      "Designed and implemented an automated MS Teams notification tool using Power Automate that reduced missed remote service requests to zero over a 1 month timeline"
    ]
  },
];
