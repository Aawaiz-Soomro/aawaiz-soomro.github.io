import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionHead } from "@/components/Reveal";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";
import { PALETTE } from "@/data/palette";
import { useScrollVar } from "@/lib/hooks";

type Entry = { kind: "Work" | "Study"; title: string; org: string; date: string; line: string; year: string };

const yearOf = (date: string) => date.match(/\d{4}/)?.[0] ?? "";
const work = (i: number): Entry => {
  const e = EXPERIENCES[i];
  return { kind: "Work", title: e.role, org: `${e.org}, ${e.location}`, date: e.date, line: e.details[0], year: yearOf(e.date) };
};
const study = (i: number): Entry => {
  const e = EDUCATION[i];
  const line = (e.details ?? []).find((d): d is string => typeof d === "string") ?? "";
  return { kind: "Study", title: e.degree, org: e.school, date: e.date, line, year: yearOf(e.date) };
};

// Work and study on one line of time, newest start first.
const ENTRIES: Entry[] = [work(0), work(1), study(0), work(2), study(1)];

/** Four digits that roll to a new year like a counter. */
function Odometer({ value }: { value: string }) {
  return (
    <span className="display outline-text flex h-[0.84em] overflow-hidden" aria-hidden="true">
      {value.split("").map((d, i) => (
        <span
          key={i}
          className="flex flex-col transition-transform duration-700 ease-out"
          style={{ transform: `translateY(-${Number(d) * 10}%)`, transitionDelay: `${i * 60}ms`, height: "8.4em" }}
        >
          {"0123456789".split("").map((n) => (
            <span key={n} className="block h-[0.84em]">
              {n}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Card({ entry, index, active, onActive }: { entry: Entry; index: number; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const scrollRef = useScrollVar<HTMLLIElement>();
  const tilt = index % 2 ? 10 : -10;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(index), { rootMargin: "-49.5% 0px -49.5% 0px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [index, onActive]);

  return (
    <li
      ref={(el) => {
        ref.current = el;
        scrollRef(el);
      }}
      style={{ "--p": 0.5 } as CSSProperties}
    >
      {/* Swings into place as it rises into view. */}
      <article
        className={`origin-bottom rounded-[2rem] p-5 text-paper-ink transition-[filter] duration-500 will-change-transform sm:p-8 md:min-h-[19rem] ${
          active ? "" : "brightness-[0.45] saturate-[0.7]"
        }`}
        style={{
          backgroundColor: PALETTE[index % PALETTE.length],
          transform: `translateY(calc(max(0, 0.3 - var(--p)) * 260px)) rotate(calc(max(0, 0.3 - var(--p)) * ${tilt * 3}deg))`,
        }}
      >
        <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.08em]">
          <span>{entry.kind}</span>
          <span>{entry.date}</span>
        </p>
        <h3 className="display mt-8 text-[clamp(2.5rem,6vw,5rem)] sm:mt-12">{entry.title}</h3>
        <p className="mt-3 text-lg font-medium">{entry.org}</p>
        <p className="mt-2 max-w-xl text-paper-ink/80">{entry.line}</p>
      </article>
    </li>
  );
}

/*
 * A big year stays pinned and rolls to each entry's year as its card crosses
 * the middle of the screen.
 */
export default function Experience() {
  const [active, setActive] = useState(0);
  const entry = ENTRIES[active];

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="experience-title" title="Experience" />

        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12">
          <div className="sticky top-16 z-10 -mx-4 flex items-end justify-between border-b border-line-strong bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 md:top-28 md:mx-0 md:block md:self-start md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p className="text-[clamp(4.25rem,21vw,6rem)] md:text-[clamp(7rem,15vw,14rem)]">
              <span className="sr-only">{entry.year}</span>
              <Odometer value={entry.year} />
            </p>
            <p className="pb-1 text-right font-mono text-xs uppercase tracking-[0.08em] text-muted md:mt-5 md:text-left">
              <span className="text-accent">{entry.kind}</span>
              <br />
              {String(active + 1).padStart(2, "0")} / {String(ENTRIES.length).padStart(2, "0")}
            </p>
          </div>

          <ol className="mt-6 space-y-5 md:mt-0 md:space-y-8">
            {ENTRIES.map((e, i) => (
              <Card key={e.title} entry={e} index={i} active={i === active} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
