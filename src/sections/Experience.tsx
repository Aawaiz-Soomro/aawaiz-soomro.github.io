import { useEffect, useRef, useState, type ReactNode } from "react";
import { SectionHead } from "@/components/Reveal";
import { EXPERIENCES } from "@/data/experience";
import { EDUCATION } from "@/data/education";
import { PALETTE } from "@/data/palette";
import { useMediaQuery } from "@/lib/hooks";

/*
 * A row of big outlined type, like the Skills rows. When a row reaches the
 * middle of the screen (or is hovered), colour sweeps across its title like
 * ink and its details light up.
 */
function Row({
  title,
  org,
  date,
  color,
  active,
  onActivate,
  children,
}: {
  title: string;
  org: string;
  date: string;
  color: string;
  active: boolean;
  onActivate: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const activate = useRef(onActivate);
  activate.current = onActivate;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && activate.current(), { rootMargin: "-49.5% 0px -49.5% 0px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      onMouseEnter={fine ? onActivate : undefined}
      className="grid gap-x-12 gap-y-3 border-b border-line py-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end md:py-9"
    >
      <div>
        <p className={`font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-500 ${active ? "text-ink" : "text-faint"}`}>{date}</p>
        <h3 className="display relative mt-3 text-[clamp(2.75rem,8.4vw,7.5rem)]">
          <span className="outline-text block">{title}</span>
          <span
            aria-hidden="true"
            className="absolute inset-0 block transition-[clip-path] duration-700 ease-out"
            style={{ color, clipPath: active ? "inset(-10% 0 -10% 0)" : "inset(-10% 100% -10% 0)" }}
          >
            {title}
          </span>
        </h3>
      </div>
      <div className={`transition-opacity duration-500 md:pb-2 ${active ? "opacity-100" : "opacity-40"}`}>
        <p className="text-lg font-medium" style={{ color: active ? color : undefined }}>
          {org}
        </p>
        <div className="mt-2 text-muted">{children}</div>
      </div>
    </li>
  );
}

function List({ children }: { children: (active: number, setActive: (i: number) => void) => ReactNode }) {
  const [active, setActive] = useState(0);
  return <ol className="border-t border-line">{children(active, setActive)}</ol>;
}

export default function Experience() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-title" className="py-16 sm:py-24">
        <div className="wrap">
          <SectionHead id="experience-title" title="Experience" />
          <List>
            {(active, setActive) =>
              EXPERIENCES.map((e, i) => (
                <Row
                  key={e.role}
                  title={e.role}
                  org={`${e.org}, ${e.location}`}
                  date={e.date}
                  color={PALETTE[i % PALETTE.length]}
                  active={active === i}
                  onActivate={() => setActive(i)}
                >
                  <p>{e.details[0]}</p>
                </Row>
              ))
            }
          </List>
        </div>
      </section>

      <section id="education" aria-labelledby="education-title" className="pb-16 sm:pb-24">
        <div className="wrap">
          <SectionHead id="education-title" title="Education" />
          <List>
            {(active, setActive) =>
              EDUCATION.map((e, i) => {
                const details = e.details ?? [];
                const line = details.find((d): d is string => typeof d === "string");
                const group = details.find((d): d is { title: string; points: string[] } => typeof d !== "string");
                return (
                  <Row
                    key={e.school}
                    title={e.degree}
                    org={e.school}
                    date={e.date}
                    color={PALETTE[(i + 3) % PALETTE.length]}
                    active={active === i}
                    onActivate={() => setActive(i)}
                  >
                    <p>{line}</p>
                    {group && <p className="mt-2 font-mono text-xs leading-relaxed">{group.points.join(" / ")}</p>}
                  </Row>
                );
              })
            }
          </List>
        </div>
      </section>
    </>
  );
}
