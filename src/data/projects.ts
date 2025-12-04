export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  thumb?: string;
  previewVideo?: string;
  mainVideo?: string;
  youtubeVideo?: string;
  previewGif?: string;
  links?: { link?: string; code?: string };
  area?: "Personal" | "University" | "Commercial";
  status?: 'Active' | 'In Progress' | 'Paused' | 'Archived' | 'Complete';
  active?: boolean;
  body?: string;
  gallery?: string[];
  objectFit?: "cover" | "contain";
};

export const PROJECTS: Project[] = [
  // Personal Projects
  {
    slug: "karachi-transit-guide",
    title: "Karachi Transit Guide",
    blurb: "A comprehensive transit guide for Karachi, helping commuters navigate the city's public transport system.",
    tags: ["React", "Vercel", "Web App", "Frontend", "UI/UX"],
    area: "Personal",
    status: "Active",
    thumb: "/media/karachi-transit-guide/thumbnail.png",


    links: {
      code: "https://github.com/Aawaiz-Soomro/Karachi_Transit_Guide_V2",
      link: "https://karachi-transit-guide.vercel.app/"
    },
    body: `The Karachi Transit Guide is a web application designed to simplify commuting in Karachi. It provides users with information about bus routes, stops, and fares, making it easier to navigate the city's complex public transport network.
    
    The project aims to bridge the information gap for daily commuters and tourists alike, offering a user-friendly interface to access vital transit data. It features a clean and responsive design, ensuring accessibility across devices. The application aggregates data on various bus lines, including the Green Line and other major routes, helping users plan their journeys efficiently.`,
  },
  {
    slug: "crypto-price-predictor",
    title: "Crypto Price Predictor AI",
    blurb: "AI-powered application for predicting cryptocurrency prices using the Gemini API.",
    tags: ["Node.js", "Gemini API", "AI/ML", "Predictive Analytics"],
    area: "Personal",
    status: "Active",
    links: {
      code: "https://github.com/Aawaiz-Soomro/Crypto-Price-Predictor-AI"
    },
    body: `This project leverages the power of the Gemini API to analyze and predict cryptocurrency prices. It serves as an AI Studio app that can be run and deployed locally.
    
    The application integrates with the Gemini API to process market data and generate price predictions. It allows users to input specific parameters and receive AI-driven insights into potential market trends. The project demonstrates the integration of Large Language Models (LLMs) into financial analysis tools, providing a practical example of AI application in the fintech domain.`,
  },
  {
    slug: "productivity-master",
    title: "Productivity Master",
    blurb: "Productivity Master is a desktop prototype that combines focus sessions, phone/website distraction alerts, and wellbeing heuristics (SMI/FOI).",
    tags: ["Python", "PyQT5 UI", "OpenCV", "MediaPipe", "YOLO", "Computer Vision"],
    area: "Personal",
    status: "Active",
    links: {
      code: "https://github.com/Aawaiz-Soomro/Productivity-Master"
    },
    body: `Productivity Master is a comprehensive desktop application designed to enhance user focus and wellbeing. It integrates advanced computer vision technologies to monitor and assist users during work sessions.
    
    The application features a PyQT5-based user interface that manages focus sessions. It utilizes OpenCV and MediaPipe to track user presence and attention, providing alerts when distractions are detected. Additionally, it employs YOLO for object detection to identify phone usage, alerting the user to minimize distractions. The system also calculates wellbeing heuristics such as the SMI (Saccadic Masking Index) and FOI (Focus of Interest) to provide insights into the user's focus levels and fatigue, promoting a balanced and productive workflow.`,
  },

  // University Projects
  {
    slug: "four-bishops-ai",
    title: "FourBishops-AI",
    blurb: "A chess variant engine exploring a bishop-heavy board composition with custom evaluation heuristics.",
    tags: ["Python", "AI/ML", "Chess", "python-chess", "Minimax", "Alpha-Beta Pruning"],
    area: "University",
    status: "Complete",
    links: {
      code: "https://github.com/Aawaiz-Soomro/FourBishops-AI"
    },
    body: `FourBishops-AI explores a unique chess variant played on a standard 8x8 board but with a significantly altered starting piece composition: 1 King, 1 Queen, 1 Rook, 1 Knight, and 4 Bishops per player.
    
    The project emphasizes diagonal control, bishop-pair synergy, and long-range threats. It uses the python-chess library with a custom FEN to enforce the variant and implements a search algorithm with a custom evaluation heuristic tailored to this specific game mode. Key features include a Minimax search algorithm with Alpha-Beta pruning, depth-based move prediction, and comprehensive analytics logging. The custom evaluation heuristic weighs factors such as material value, mobility, center dominance, and bishop-pair synergy to optimize gameplay strategies for this specific variant.`,
  },
  {
    slug: "libradb",
    title: "LibraDB",
    blurb: "A Library Management System built with Flask and SQLite, featuring role-aware portals and librarian approvals.",
    tags: ["Python", "Flask", "SQLite", "Web App", "Backend Development", "Database Design"],
    area: "University",
    status: "Complete",
    links: {
      code: "https://github.com/Aawaiz-Soomro/Libra-DB-Vercel",
      link: "https://libra-db-vercel.vercel.app/"
    },
    body: `LibraDB is a comprehensive Library Management System designed to streamline library operations. It features a robust backend built with Flask and SQLite, ensuring efficient data management and retrieval.
    
    The system includes a single login/registration screen that intelligently directs users to role-specific portals (Librarian or Member). Key features include a librarian approval workflow for book requests, detailed user management, and a cataloging system. The project demonstrates full-stack web development principles, including database schema design, RESTful API implementation, and secure user authentication.`,
  },
  {
    slug: "taskflow",
    title: "TaskFlow",
    blurb: "A C++ task management system built with OOP principles, offering tagging, team management, and alerts.",
    tags: ["C++", "OOP", "System Design", "Data Structures", "File I/O"],
    area: "University",
    status: "Complete",
    links: {
      code: "https://github.com/Aawaiz-Soomro/TaskFlow"
    },
    body: `TaskFlow is a robust task management system developed using C++ and Object-Oriented Programming (OOP) principles. It provides a complete workspace for users to create, organize, and track tasks and projects efficiently.
    
    The system supports individual users as well as teams, enabling collaboration and clear task delegation. Key features include secure user authentication, project organization, task tagging, due date alerts, and a powerful search function. It also generates reports on task statuses and deadlines. This project serves as a strong demonstration of advanced C++ concepts, including class inheritance, polymorphism, and file handling for data persistence.`,
  },
  {
    slug: "tetris-sfml",
    title: "Tetris (SFML)",
    blurb: "A classic Tetris game implementation using C++ and the SFML library.",
    tags: ["C++", "SFML", "Game Dev", "Graphics Programming", "Event Handling"],
    area: "University",
    status: "Complete",
    links: {
      code: "#" // Placeholder
    },
    body: `This project is a faithful recreation of the classic Tetris game, built from scratch using C++ and the Simple and Fast Multimedia Library (SFML). It handles complex game logic, real-time graphics rendering, and user input to provide a smooth and responsive gaming experience.
    
    The implementation covers core game mechanics such as tetromino rotation, collision detection, line clearing, and score calculation. It demonstrates proficiency in game loop architecture, 2D graphics programming, and event-driven programming within the C++ ecosystem.`,
  },
];