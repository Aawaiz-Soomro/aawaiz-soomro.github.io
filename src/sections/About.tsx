import { useEffect, useRef, type CSSProperties } from "react";
import { Fade, SectionHead } from "@/components/Reveal";
import { PROFILE } from "@/data/links";
import { PROJECTS } from "@/data/projects";
import { SKILL_CATEGORIES } from "@/data/skills";
import { useReducedMotion } from "@/lib/hooks";

const WORDS = `${PROFILE.intro} ${PROFILE.about[0]}`.split(" ");

const FACTS = [
  { value: String(PROJECTS.length).padStart(2, "0"), label: "Projects shipped" },
  { value: "20+", label: "Websites built at MediaByte" },
  { value: "9.5M", label: "Posts behind my FYP model" },
  { value: "2026", label: "Graduating, BS CS" },
];

export function Marquee() {
  const items = SKILL_CATEGORIES.flatMap((c) => c.skills.slice(0, 3));
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((s, i) => (
        <li key={s} className="flex items-center">
          <span className={`display px-5 text-[clamp(2.5rem,6vw,5rem)] ${i % 2 ? "outline-text" : "text-ink"}`}>{s}</span>
          <span aria-hidden="true" className="size-3 rotate-45 bg-accent sm:size-4" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-line-strong bg-bg py-5 sm:py-7">
      <div className="flex w-max motion-safe:animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  // Words light up as the paragraph crosses the middle of the screen.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHead index="01" id="about-title" title="About" note="Who I am, in a few lines." />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <p
            ref={textRef}
            className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em]"
            style={{ "--p": 0 } as CSSProperties}
          >
            <span className="sr-only">{WORDS.join(" ")}</span>
            <span aria-hidden="true">
              {WORDS.map((w, i) => (
                <span
                  key={i}
                  style={{ opacity: `clamp(0.16, calc(var(--p) * ${WORDS.length + 4} - ${i}), 1)` }}
                >
                  {w}{" "}
                </span>
              ))}
            </span>
          </p>

          <Fade className="space-y-5 text-lg leading-relaxed text-muted lg:pt-2">
            <p>{PROFILE.about[1]}</p>
            <p>{PROFILE.about[2]}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-accent">
              {PROFILE.titles.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </Fade>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Fade key={f.label} delay={i * 80} className="border-b border-r border-line p-5 sm:p-7">
              <dt className="sr-only">{f.label}</dt>
              <dd className="display text-[clamp(3rem,6.5vw,5.5rem)] text-ink">{f.value}</dd>
              <dd className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">{f.label}</dd>
            </Fade>
          ))}
        </dl>
      </div>
    </section>
  );
}
