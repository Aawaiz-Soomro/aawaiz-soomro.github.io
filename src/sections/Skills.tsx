import Marquee from "@/components/Marquee";
import { SectionHead } from "@/components/Reveal";
import { SKILL_CATEGORIES } from "@/data/skills";

/* One moving row per category; rows alternate direction and react to the scroll. */
export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="overflow-hidden py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="skills-title" title="Skills" />
      </div>
      {SKILL_CATEGORIES.map((cat, i) => (
        <div key={cat.id} className="border-b border-line py-3 sm:py-4">
          <p className="wrap font-mono text-xs uppercase tracking-[0.08em] text-accent">{cat.title}</p>
          <Marquee reverse={i % 2 === 1} speed={0.035 + i * 0.006} className="mt-1">
            {cat.skills.map((s, j) => (
              <span key={s} className={`display px-4 text-[clamp(2.5rem,7vw,5.5rem)] sm:px-6 ${(i + j) % 2 ? "outline-text" : ""}`}>
                {s}
              </span>
            ))}
          </Marquee>
        </div>
      ))}
    </section>
  );
}
