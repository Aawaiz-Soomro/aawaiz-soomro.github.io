import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Fade, SectionHead } from "@/components/Reveal";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";

function Row({
  index,
  title,
  org,
  date,
  place,
  children,
  defaultOpen = false,
}: {
  index: number;
  title: string;
  org: string;
  date: string;
  place?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <li className="border-b border-line">
      <Fade delay={index * 60}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-2 py-6 text-left transition-colors duration-300 hover:bg-surface sm:px-5 md:grid-cols-[11rem_1fr_auto] md:py-8"
        >
          <span className="col-span-2 text-sm text-muted md:col-span-1">{date}</span>
          <span>
            <span className="display block text-[clamp(2rem,4.6vw,3.75rem)] transition-colors duration-300 group-hover:text-accent">{title}</span>
            <span className="mt-2 block text-accent">
              {org}
              {place && <span className="text-muted">, {place}</span>}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`grid size-11 place-items-center rounded-full border border-line-strong transition-[transform,background-color,color] duration-500 ease-out ${
              open ? "rotate-45 bg-accent text-on-accent" : "text-ink"
            }`}
          >
            <Plus className="size-5" />
          </span>
        </button>
        <div id={id} className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden" inert={!open}>
            <div className="px-2 pb-8 sm:px-5 md:pl-[calc(11rem+2.75rem)]">{children}</div>
          </div>
        </div>
      </Fade>
    </li>
  );
}

const Points = ({ items }: { items: string[] }) => (
  <ul className="max-w-2xl space-y-2.5 text-lg leading-relaxed text-muted">
    {items.map((p) => (
      <li key={p} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent">
        {p}
      </li>
    ))}
  </ul>
);

const Chips = ({ items }: { items: string[] }) => <p className="mt-4 text-muted">{items.join(", ")}</p>;

export default function Experience() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-title" className="py-16 sm:py-24">
        <div className="wrap">
          <SectionHead id="experience-title" title="Experience" />
          <ol className="border-t border-line">
            {EXPERIENCES.map((e, i) => (
              <Row key={e.role} index={i} title={e.role} org={e.org} date={e.date} place={e.location} defaultOpen={i === 0}>
                <Points items={e.details} />
                {e.skills && <Chips items={e.skills} />}
              </Row>
            ))}
          </ol>
        </div>
      </section>

      <section id="education" aria-labelledby="education-title" className="pb-16 sm:pb-24">
        <div className="wrap">
          <SectionHead id="education-title" title="Education" />
          <ol className="border-t border-line">
            {EDUCATION.map((e, i) => {
              const details = e.details ?? [];
              return (
                <Row key={e.school} index={i} title={e.degree} org={e.school} date={e.date} defaultOpen={i === 0}>
                  <Points items={details.filter((d): d is string => typeof d === "string")} />
                  {details
                    .filter((d): d is { title: string; points: string[] } => typeof d !== "string")
                    .map((g) => (
                      <div key={g.title} className="mt-6">
                        <p className="font-medium text-ink">{g.title}</p>
                        <Chips items={g.points} />
                      </div>
                    ))}
                </Row>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
