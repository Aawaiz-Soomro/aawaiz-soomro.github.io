export type PubType = "paper" | "article" | "talk" | "poster" | "video" | "demo";

export type Publication = {
  title: string;
  outlet?: string;         // conference, journal, site, venue
  date?: string;           // e.g. "Aug 2025"
  type: PubType;
  authors?: string[];        // optional string for now
  // Media
  href?: string;           // canonical link (paper page, YouTube, arXiv, etc.)
  code?: string;
  pdf?: string;            // if you want a direct pdf link (public/…)
  thumb?: string;          // poster/thumbnail image (public/… or remote)
  previewVideo?: string;   // short mp4/webm (public/… or remote) for hover
  previewGif?: string;     // optional fallback gif if you prefer
};

export const PUBLICATIONS: Publication[] = [
  {
    title: "Best Overall Winners! HackGT 12 Hackathon Competition",
    outlet: "HackGT 12",
    date: "2026",
    type: "demo",
    authors: ["Ojas Mediratta", "Dawson Pent", "James Li", "David Serrao"],
    href: "https://devpost.com/software/dose-ebmo9z", // external link
    thumb: "media/hackGT12/dose_pub_thumb.jpeg",
  }
  // {
  //   title: "Underwater Robotic Platform for Dolphin Vocalization Studies",
  //   outlet: "Tangible, Embedded and Embodied Interaction (TEI) Conference",
  //   date: "2026",
  //   type: "paper",
  //   authors: ["Riley Mehrman", "Ojas Mediratta", "Dawson Pent", "Charles D. Ramey"],
  //   href: "https://example.com/project", // external paper link
  //   thumb: "media/blip-auv/blip_11.jpg",
  //   previewVideo: "media/blip-auv/blip_preview.mp4",
  // },
];