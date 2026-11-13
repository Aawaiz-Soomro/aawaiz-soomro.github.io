import { useEffect, useRef, useState } from "react";
import { SectionHead } from "@/components/Reveal";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";
import { PALETTE as COLORS } from "@/data/palette";
import { useMediaQuery } from "@/lib/hooks";

type Entry = { title: string; org: string; date: string; line: string };

const WORK: Entry[] = EXPERIENCES.map((e) => ({ title: e.role, org: `${e.org}, ${e.location}`, date: e.date, line: e.details[0] }));
const STUDY: Entry[] = EDUCATION.map((e) => ({
  title: e.degree,
  org: e.school,
  date: e.date,
  line: (e.details ?? []).find((d): d is string => typeof d === "string") ?? "",
}));


/*
 * A row with a big year. With a mouse it fills with colour on hover; on touch
 * screens the row in the middle of the screen fills as you scroll.
 */
function Row({ entry, color }: { entry: Entry; color: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const touch = !useMediaQuery("(hover: hover) and (pointer: fine)");
  const [active, setActive] = useState(false);
  const year = entry.date.match(/\d{4}/)?.[0] ?? "";

  useEffect(() => {
    if (!touch) return setActive(false);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "-49.5% 0px -49.5% 0px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [touch]);

  return (
    <li
      ref={ref}
      data-active={active}
      className="group relative mb-3 overflow-hidden rounded-[2rem] border border-line"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 group-data-[active=true]:scale-y-100"
        style={{ backgroundColor: color }}
      />
      <div className="relative grid gap-x-10 gap-y-1 px-3 py-6 transition-colors duration-300 group-hover:text-paper-ink group-data-[active=true]:text-paper-ink sm:px-6 md:grid-cols-[minmax(0,15rem)_1fr] md:items-center md:py-9">
        <p
          className="display text-[clamp(3.5rem,11vw,8rem)] text-line-strong transition-colors duration-300 group-hover:text-paper-ink group-data-[active=true]:text-paper-ink"
        >
          {year}
        </p>
        <div>
          <h3 className="display text-[clamp(2rem,4.8vw,4rem)]">{entry.title}</h3>
          <p className="mt-2 font-medium">
            {entry.org} <span className="opacity-70">({entry.date})</span>
          </p>
          <p className="mt-2 max-w-2xl opacity-80">{entry.line}</p>
        </div>
      </div>
    </li>
  );
}

export default function Experience() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-title" className="py-16 sm:py-24">
        <div className="wrap">
          <SectionHead id="experience-title" title="Experience" />
          <ol>
            {WORK.map((e, i) => (
              <Row key={e.title} entry={e} color={COLORS[i % COLORS.length]} />
            ))}
          </ol>
        </div>
      </section>

      <section id="education" aria-labelledby="education-title" className="pb-16 sm:pb-24">
        <div className="wrap">
          <SectionHead id="education-title" title="Education" />
          <ol>
            {STUDY.map((e, i) => (
              <Row key={e.title} entry={e} color={COLORS[(i + WORK.length) % COLORS.length]} />
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
