import { Fade, SectionHead } from "@/components/Reveal";
import { SKILL_CATEGORIES } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHead index="04" id="skills-title" title="Skills" note="The tools I reach for." />

        <ul className="border-t border-line">
          {SKILL_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <li key={cat.id}>
                <Fade
                  delay={i * 50}
                  className="group grid items-center gap-4 border-b border-line px-2 py-6 transition-colors duration-300 hover:bg-surface sm:px-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-10 md:py-8"
                >
                  <h3 className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-accent transition-[background-color,color,transform] duration-500 ease-out group-hover:rotate-[360deg] group-hover:bg-accent group-hover:text-on-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="display text-[clamp(2.25rem,5vw,4.25rem)] transition-colors duration-300 group-hover:text-accent">
                      {cat.title}
                    </span>
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-line-strong px-3.5 py-1.5 font-mono text-[13px] text-ink transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-on-accent"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Fade>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
