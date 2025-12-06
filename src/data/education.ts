export type EducationDetailGroup = {
    title: string;
    points: string[];
};

export type Education = {
    school: string;
    degree: string;
    date: string;
    details?: (string | EducationDetailGroup)[];
    logoKey?: "gt";      // add keys for each logo component you wire up
    logoSize?: number;   // px (optional)
    logoStroke?: number; // only relevant if your SVG uses strokes
};


export const EDUCATION: Education[] = [
    {
        school: "National University of Computer and Emerging Sciences (NUCES-FAST)",
        degree: "B.S. Computer Science",
        date: "Aug 2022 – Aug 2026",
        details: [
            "Developing strong foundations in computer science, algorithms, backend engineering, and AI-related coursework.",
            "Teaching Assistant for Data Structures, helping students strengthen their understanding of core CS concepts.",
            "Actively involved in departmental technical initiatives, academic activities, and leadership roles.",
            {
                title: "Activities and Societies",
                points: [
                    "VP – Microsoft Learn Student Ambassadors (MLSA)",
                    "PR Executive – Procom'24",
                    "GR Co-head – CBS",
                ],
            },
        ],
        logoKey: "gt",
        logoSize: 72,
    },
    {
        school: "Rockford Cambridge School",
        degree: "O/A Levels, Computer Science",
        date: "Feb 2017 – Aug 2022",
        details: [
            "Achieved strong academic performance with A and A* grades in O and A Levels.",
            "Built a strong foundation in analytical reasoning, mathematics, and computer science.",
            {
                title: "Activities and Societies",
                points: [
                    "1st Place – Video Editing Competition",
                    "2nd Place – Spelling Bee",
                    "1st Place – Table Tennis Tournament",
                ],
            },
        ],
        logoKey: "gt",
        logoSize: 72,
    },
];

