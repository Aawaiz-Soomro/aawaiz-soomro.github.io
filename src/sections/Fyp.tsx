import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHead } from "@/components/Reveal";
import { PROJECTS } from "@/data/projects";
import { RESEARCH } from "@/data/research";
import { withBase } from "@/data/links";
import { useInView, useReducedMotion, useScrollVar } from "@/lib/hooks";

/** Counts up to a value like "9.5M" or "256-d" when it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const num = match?.[1] ?? "0";
  const suffix = match?.[2] ?? value;
  const target = parseFloat(num);
  const decimals = (num.split(".")[1] ?? "").length;
  const [ref, seen] = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (reduced) return setShown(target);
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      setShown(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const pill = "group inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-transform duration-200 ease-out active:scale-90";

export default function Fyp() {
  const paper = RESEARCH[0];
  const project = PROJECTS.find((p) => p.featured);
  const scrollRef = useScrollVar<HTMLDivElement>();
  if (!paper || !project) return null;

  return (
    <section id="fyp" aria-labelledby="fyp-title" className="py-16 sm:py-24">
      <div className="wrap">
       <div className="rounded-[2rem] bg-accent px-4 py-8 text-on-accent sm:px-10 sm:py-12">
        <SectionHead id="fyp-title" title="FYP" />
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.02em]">{paper.title}</h3>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {project.stats?.map((s) => (
                <div key={s.label} className="border-t-2 border-on-accent pt-3">
                  <dd className="display text-[clamp(2.4rem,7vw,6rem)]">
                    <CountUp value={s.value} />
                  </dd>
                  <dt className="mt-2 text-sm leading-snug">{s.label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex flex-wrap gap-3">
              {paper.href && (
                <a href={withBase(paper.href)} target="_blank" rel="noreferrer" className={`${pill} bg-on-accent text-accent`}>
                  Read the paper <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              )}
              <Link to={`/projects/${project.slug}`} className={`${pill} border-2 border-on-accent`}>
                Project page
              </Link>
            </div>
          </div>

          {paper.thumb && (
            <div ref={scrollRef} style={{ "--p": 0.5 } as CSSProperties} className="grid place-items-center py-4">
              <a href={withBase(paper.href)} target="_blank" rel="noreferrer" aria-label="Open the paper (PDF)">
                <img
                  src={withBase(paper.thumb)}
                  alt=""
                  loading="lazy"
                  className="w-[min(70vw,22rem)] shadow-2xl shadow-black/40 will-change-transform"
                  style={{ transform: "rotate(calc((0.5 - var(--p)) * 28deg)) translateY(calc((0.5 - var(--p)) * 60px))" }}
                />
              </a>
            </div>
          )}
        </div>
       </div>
      </div>
    </section>
  );
}
