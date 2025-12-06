export type PubType = "Paper" | "Article" | "Talk" | "Poster" | "Video" | "Demo" | "Award" | "Other";
export type Status = "Under Review" | "Published" | "Accepted" | "In Press";

export type Research = {
  title: string;
  outlet?: string;         // conference, journal, site, venue
  date?: string;           // e.g. "Aug 2025"
  type: PubType;
  authors?: string[];        // optional string for now
  status?: Status;  // publication status
  // Media
  href?: string;           // canonical link (paper page, YouTube, arXiv, etc.)
  code?: string;
  pdf?: string;            // if you want a direct pdf link (public/…)
  thumb?: string;          // poster/thumbnail image (public/… or remote)
  previewVideo?: string;   // short mp4/webm (public/… or remote) for hover
  previewGif?: string;     // optional fallback gif if you prefer
};

export const RESEARCH: Research[] = [
  {
    title: "AI Powered Influencer MarketPlace",
    outlet: "Final Year Project @ NUCES-FAST",
    date: "2026",
    type: "Paper",
    authors: ["Taha", "Aawaiz", "Humam"],
    status: "Under Review",
    // href: "https://example.com/project", 
    // href: "https://example.com/project",
  },
  // {
  //   title: "Contestant on The 1% Club",
  //   outlet: "Amazon Prime Video TV Series",
  //   date: "2026",
  //   type: "Other",
  //   href: "https://example.com/link", // external link
  //   thumb: "thumbnail.png",
  //   previewVideo: "preview.mp4",
  // },
  // {
  //   title: "First in Track Winner! (Snowflake AI Cloud) AI ATL '25 Hackathon",
  //   outlet: "AI ATL",
  //   date: "2025",
  //   type: "Award",
  //   authors: ["Ojas Mediratta", "Fawaz Sabir", "Navadeep Budda", "Aditya Mukker"],
  //   href: "https://devpost.com/software/lucid-nijx3r", 
  //   thumb: "media/ai-atl25/winner_pub_thumb.JPEG",
  // },
  // {
  //   title: "Best Overall Winners! HackGT 12 Hackathon Competition",
  //   outlet: "HackGT 12",
  //   date: "2026",
  //   type: "Award",
  //   authors: ["Ojas Mediratta", "Dawson Pent", "James Li", "David Serrao"],
  //   href: "https://devpost.com/software/dose-ebmo9z", // external link
  //   thumb: "media/hackGT12/dose_pub_thumb.jpeg",
  // },
];