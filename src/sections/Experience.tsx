import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import { SectionHead } from "@/components/Reveal";
import Tile from "@/components/Tile";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";
import { BLUE, LILAC, MINT, ORANGE, YELLOW } from "@/data/palette";

/* An entry as a tile: icon and date up top, title and place below. */
function Entry({
  icon: Icon,
  color,
  date,
  title,
  org,
  line,
  extra,
  delay,
}: {
  icon: LucideIcon;
  color: string;
  date: string;
  title: string;
  org: string;
  line?: string;
  extra?: string;
  delay: number;
}) {
  return (
    <li className="h-full">
      <Tile color={color} delay={delay} className="h-full">
        <article className="flex h-full min-h-[17rem] flex-col justify-between gap-10 p-5 sm:p-6">
          <p className="flex items-start justify-between gap-3">
            <Icon className="size-9" aria-hidden="true" />
            <span className="rounded-full bg-paper-ink px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-white">{date}</span>
          </p>
          <div>
            <h3 className="display text-[clamp(2.25rem,3.7vw,3.5rem)]">{title}</h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.06em] opacity-70">{org}</p>
            {line && <p className="mt-4 leading-snug text-paper-ink/85">{line}</p>}
            {extra && <p className="mt-3 font-mono text-[11px] leading-relaxed opacity-70">{extra}</p>}
          </div>
        </article>
      </Tile>
    </li>
  );
}

const WORK_COLORS = [MINT, BLUE, LILAC];
const STUDY_COLORS = [YELLOW, ORANGE];

export default function Experience() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-title" className="py-16 sm:py-24">
        <div className="wrap">
          <SectionHead id="experience-title" title="Experience" />
          <ol className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {EXPERIENCES.map((e, i) => (
              <Entry
                key={e.role}
                icon={Briefcase}
                color={WORK_COLORS[i % WORK_COLORS.length]}
                date={e.date}
                title={e.role}
                org={`${e.org}, ${e.location}`}
                line={e.details[0]}
                delay={i * 110}
              />
            ))}
          </ol>
        </div>
      </section>

      <section id="education" aria-labelledby="education-title" className="pb-16 sm:pb-24">
        <div className="wrap">
          <SectionHead id="education-title" title="Education" />
          <ol className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {EDUCATION.map((e, i) => {
              const details = e.details ?? [];
              const group = details.find((d): d is { title: string; points: string[] } => typeof d !== "string");
              return (
                <Entry
                  key={e.school}
                  icon={GraduationCap}
                  color={STUDY_COLORS[i % STUDY_COLORS.length]}
                  date={e.date}
                  title={e.degree}
                  org={e.school}
                  line={details.find((d): d is string => typeof d === "string")}
                  extra={group?.points.join(" / ")}
                  delay={i * 110}
                />
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
