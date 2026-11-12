/** The stack table. `cluster` ties each row to a region of the hero field. */
export type StackRow = { id: Cluster; title: string; items: string[] };
export type Cluster = "ai" | "backend" | "web" | "systems" | "tools";

export const STACK: StackRow[] = [
  { id: "ai", title: "AI and vision", items: ["PyTorch", "OpenCLIP", "OpenCV", "TensorFlow", "YOLO", "MediaPipe", "scikit-learn", "LLM APIs"] },
  { id: "backend", title: "Backend and data", items: ["Python", "FastAPI", "Flask", "PostgreSQL", "pgvector", "Supabase", "SQLAlchemy", "SQLite", "NeonDB"] },
  { id: "web", title: "Web", items: ["TypeScript", "React", "Next.js", "Vue", "Tailwind CSS", "Framer Motion", "Node.js"] },
  { id: "systems", title: "Systems", items: ["C++", "OOP", "Data structures", "SFML", "Minimax search"] },
  { id: "tools", title: "Tools", items: ["Git", "Docker", "Linux", "Vercel", "WordPress"] },
];
