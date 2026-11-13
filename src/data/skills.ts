import {
    Code2,
    Layout,
    Database,
    BrainCircuit,
    Wrench,
    type LucideIcon
} from 'lucide-react';

export type SkillCategory = {
    id: string;
    title: string;
    icon: LucideIcon;
    skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        id: 'languages',
        title: 'Languages',
        icon: Code2,
        skills: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'HTML/CSS']
    },
    {
        id: 'frontend',
        title: 'Frontend',
        icon: Layout,
        skills: ['React', 'Vue', 'TailwindCSS', 'Next.js', 'Framer Motion']
    },
    {
        id: 'backend',
        title: 'Backend & DB',
        icon: Database,
        skills: ['SQL Alchemy', 'Flask', 'PostgreSQL', 'SQLite', 'NeonDB', 'SupaBase']
    },
    {
        id: 'ai',
        title: 'AI & Data Science',
        icon: BrainCircuit,
        skills: ['PyTorch', 'OpenCV', 'TensorFlow', 'AI LLM APIs', 'YOLO', 'Scikit-learn']
    },
    {
        id: 'tools',
        title: 'Tools & DevOps',
        icon: Wrench,
        skills: ['Git', 'Docker', 'Linux', 'Vercel', 'VS Code', 'Anti-Gravity', 'Wordpress']
    }
];
