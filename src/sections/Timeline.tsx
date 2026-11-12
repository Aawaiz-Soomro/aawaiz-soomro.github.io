import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";

type Entry = {
  kind: "Work" | "Study";
  title: string;
  org: string;
  date: string;
  place?: string;
  points: string[];
  groups: { title: string; points: string[] }[];
  tags: string[];
};

const fromExperience = (i: number): Entry => {
  const e = EXPERIENCES[i];
  return { kind: "Work", title: e.role, org: e.org, date: e.date, place: e.location, points: e.details, groups: [], tags: e.skills ?? [] };
};
const fromEducation = (i: number): Entry => {
  const e = EDUCATION[i];
  const details = e.details ?? [];
  return {
    kind: "Study",
    title: e.degree,
    org: e.school,
    date: e.date,
    points: details.filter((d): d is string => typeof d === "string"),
    groups: details.filter((d): d is { title: string; points: string[] } => typeof d !== "string"),
    tags: [],
  };
};

// Newest first; ongoing entries lead.
const ENTRIES: Entry[] = [fromExperience(0), fromEducation(0), fromExperience(1), fromExperience(2), fromEducation(1)];

export default function Timeline() {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="kicker text-signal">~/timeline</p>
          <h2 id="timeline-title" className="mt-3 font-mono text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-none tracking-[-0.04em]">
            Timeline
          </h2>
          <p className="mt-5 max-w-xs text-muted">Work and study, newest first.</p>
        </div>

        <ol className="relative border-l border-line-strong">
          {ENTRIES.map((e, i) => (
            <Item key={`${e.org}-${e.title}`} entry={e} defaultOpen={i === 0} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Item({ entry, defaultOpen }: { entry: Entry; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const current = /present|2026/i.test(entry.date);

  return (
    <li className="relative pb-4 pl-6 sm:pl-10">
      <span
        aria-hidden="true"
        className={`absolute -left-[5px] top-8 size-[9px] rounded-full ring-4 ring-bg ${current ? "bg-accent" : "bg-line-strong"}`}
      />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-start gap-4 rounded-xl px-0 py-5 text-left sm:px-4 sm:hover:bg-surface"
      >
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap gap-x-4 font-mono text-sm text-muted">
            <span>{entry.date}</span>
            <span className="text-faint">{entry.kind}</span>
          </p>
          <h3 className="mt-2 font-mono text-xl font-semibold tracking-tight sm:text-2xl">{entry.title}</h3>
          <p className="mt-1 text-accent-ink">
            {entry.org}
            {entry.place && <span className="text-muted">, {entry.place}</span>}
          </p>
        </div>
        <Plus
          aria-hidden="true"
          className={`mt-1 size-5 shrink-0 text-muted transition-transform duration-200 ease-out group-hover:text-ink ${open ? "rotate-45" : ""}`}
        />
      </button>

      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-6 sm:px-4">
            <ul className="max-w-2xl space-y-2 text-muted">
              {entry.points.map((p) => (
                <li key={p} className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-faint">
                  {p}
                </li>
              ))}
            </ul>
            {entry.groups.map((g) => (
              <div key={g.title} className="mt-5">
                <p className="font-mono text-sm text-ink">{g.title}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {g.points.map((p) => (
                    <li key={p} className="rounded-md border border-line px-2.5 py-1 text-sm text-muted">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {entry.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-4 font-mono text-sm text-faint" aria-label="Skills">
                {entry.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
