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
  // {
  //   role: "Graduate Research Assistant",
  //   org: "Laboratory for Intelligent Decision and Autonomous Robotics (LIDAR) @ Georgia Tech",
  //   date: "Jan 2026 – Present",
  //   details: [
  //     "Conducting research on tactile sensing for humanoid loco-manipulation and RL for collaborative transport and whole-body manipulation",
  //     "Integrated tactile sensors into a humanoid robot platform, enabling enhanced manipulation capabilities for complex tasks",
  //   ]
  // },
  {
    role: "Graduate Research Assistant",
    org: "Contextual Computing Group @ Georgia Tech",
    date: "Aug 2024 – Present",
    details: [
      "Led field-robotics work with an aquarium and a nonprofit, running controlled pool trials and open-water deployments of a custom marine robot to advance real-time dolphin communication and enrichment research",
      "Designed and built a bone-conduction headset for underwater use by researchers, enabling clear audio playback for real-time dolphin vocalization translation and two-way communication between researchers and dolphins",
      "Packaged analysis pipelines and documentation so collaborators could reproduce results and generate new stimuli without engineer support during field and lab research sessions",
      "Developed Python tools for autocorrelation, waveform reconstruction, and spectrogram analysis that turned raw recordings into testable audio stimulus libraries and reduced manual preprocessing",
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
      "Responded to triaged security incidents and lead a team of 12 student assistants to proficiency for support to over 30 departments of Georgia Tech personnel via remote and on-site assistance",
      "Programmed and deployed a PowerShell script for verifying device imaging and task sequences that reduced setup time for our team by 50% in most cases",
      "Migrated enterprise device management from the SCCM platform to Microsoft Endpoint/Intune, enabling more streamlined deployment of over 15 distinct user profiles with associated software and service access",
      "Designed and implemented an automated MS Teams notification tool using Power Automate that reduced missed remote service requests to zero over a 1 month timeline"
    ]
  },
];
