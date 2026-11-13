import { Fade, SectionHead } from "@/components/Reveal";
import { SKILL_CATEGORIES } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="skills-title" title="Skills" />
        <dl>
          {SKILL_CATEGORIES.map((cat, i) => (
            <Fade key={cat.id} delay={i * 50} className="grid gap-2 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-baseline md:gap-10 md:py-7">
              <dt className="text-muted md:text-lg">{cat.title}</dt>
              <dd className="text-xl leading-snug sm:text-2xl">{cat.skills.join(", ")}</dd>
            </Fade>
          ))}
        </dl>
      </div>
    </section>
  );
}
