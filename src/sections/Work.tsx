import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Github } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { RESEARCH } from "@/data/research";
import { withBase } from "@/data/links";
import { useReducedMotion } from "@/lib/hooks";

const FILTERS = ["All", "AI", "Personal", "University"] as const;
type Filter = (typeof FILTERS)[number];

const areas = (p: Project) => (Array.isArray(p.area) ? p.area : p.area ? [p.area] : []);
const matches = (p: Project, f: Filter) => f === "All" || areas(p).includes(f);

export default function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const reduced = useReducedMotion();
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured && matches(p, filter));
  const showFeatured = featured && matches(featured, filter);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f, PROJECTS.filter((p) => matches(p, f)).length])),
    []
  );

  const choose = (f: Filter) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !reduced) doc.startViewTransition(() => flushSync(() => setFilter(f)));
    else setFilter(f);
  };

  return (
    <section id="work" aria-labelledby="work-title" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker text-signal">~/work</p>
            <h2 id="work-title" className="mt-3 font-mono text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-none tracking-[-0.04em]">
              Selected work
            </h2>
          </div>
          <div role="group" aria-label="Filter projects" className="flex gap-1 rounded-xl border border-line bg-surface p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => choose(f)}
                className={`flex items-baseline gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 font-mono text-sm sm:px-3.5 transition-colors duration-150 ${
                  filter === f ? "bg-accent text-on-accent" : "text-muted hover:bg-raised hover:text-ink"
                }`}
              >
                {f}
                <span className={`hidden text-xs sm:inline ${filter === f ? "opacity-70" : "text-faint"}`}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {showFeatured && <Featured project={featured} />}

        <ProjectList projects={rest} />
      </div>
    </section>
  );
}

function Featured({ project }: { project: Project }) {
  const paper = RESEARCH[0];
  const team = paper?.members?.filter((m) => m !== "Aawaiz");

  return (
    <article className="mt-12 grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col p-6 sm:p-10">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
          <span className="text-accent-ink">Final year project</span>
          {paper?.status && (
            <span className="flex items-center gap-2 text-muted">
              <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
              Paper {paper.status.toLowerCase()}
            </span>
          )}
        </p>
        <h3 className="mt-4 font-mono text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-none tracking-[-0.04em]">
          {project.title}
        </h3>
        <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-muted">
          Brands pick influencers by follower count. Influenza picks them by what they actually post: every creator’s
          history becomes one vector, and campaigns are matched by meaning, not metrics.
        </p>

        {project.stats && (
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            {project.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-none tracking-tight text-ink">
                  {s.value}
                </dd>
                <dd className="mt-2 text-sm leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-muted" aria-label="Built with">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {paper && team?.length ? (
          <p className="mt-4 text-sm text-muted">
            With {team.join(" and ")}, supervised by {paper.supervisor}.
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
          <Link
            to={`/projects/${project.slug}`}
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 font-mono text-sm font-semibold text-on-accent transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Case study
            <ArrowUpRight className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          {paper?.href && (
            <a
              href={withBase(paper.href)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong px-4 font-mono text-sm text-ink transition-colors hover:border-faint"
            >
              <FileText className="size-4" /> Read the paper
            </a>
          )}
          {project.links?.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong px-4 font-mono text-sm text-ink transition-colors hover:border-faint"
            >
              <Github className="size-4" /> Code
            </a>
          )}
        </div>
      </div>

      {paper?.thumb && (
        <a
          href={withBase(paper.href)}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the Influenza paper (PDF)"
          className="group relative grid min-h-[22rem] place-items-center overflow-hidden border-t border-line bg-raised bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] bg-size-[18px_18px] p-8 lg:border-l lg:border-t-0"
        >
          <img
            src={withBase(paper.thumb)}
            alt=""
            loading="lazy"
            className="w-[min(100%,24rem)] rotate-[-4deg] rounded-sm shadow-2xl shadow-black/40 ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-4 right-4 rounded-md bg-bg/80 px-2 py-1 font-mono text-xs text-muted backdrop-blur">
            fyp_paper.pdf
          </span>
        </a>
      )}
    </article>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const reduced = useReducedMotion();
  const target = useRef({ x: 0, y: 0, vx: 0 });

  useEffect(() => {
    setFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // The preview card follows the cursor with a little lag and tilts with speed.
  useEffect(() => {
    if (!finePointer) return;
    let raf = 0;
    const pos = { x: 0, y: 0, r: 0 };
    let started = false;
    const tick = () => {
      const t = target.current;
      if (!started) {
        pos.x = t.x;
        pos.y = t.y;
        started = true;
      }
      const k = reduced ? 1 : 0.18;
      pos.x += (t.x - pos.x) * k;
      pos.y += (t.y - pos.y) * k;
      pos.r += ((reduced ? 0 : Math.max(-8, Math.min(8, t.vx * 0.4))) - pos.r) * 0.12;
      t.vx *= 0.85;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${pos.x + 28}px, ${pos.y - 200}px, 0) rotate(${pos.r}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finePointer, reduced]);

  const onMove = (e: React.PointerEvent) => {
    const t = target.current;
    t.vx = e.clientX - t.x;
    t.x = e.clientX;
    t.y = e.clientY;
  };

  if (!projects.length) {
    return <p className="mt-12 text-muted">No projects in this category yet.</p>;
  }

  return (
    <>
      <ul className="mt-12 border-t border-line" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              to={`/projects/${p.slug}`}
              onPointerEnter={() => setHovered(p)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 gap-y-1 py-5 transition-colors duration-200 hover:bg-surface sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_auto_auto] sm:gap-x-8 sm:px-4 sm:py-7"
            >
              {p.thumb && (
                <img
                  src={p.thumb}
                  alt=""
                  loading="lazy"
                  className="row-span-2 size-14 rounded-lg bg-white object-contain p-1 sm:hidden"
                />
              )}
              <h3 className="flex items-center gap-3 font-mono text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-accent-ink sm:text-[1.75rem]">
                <span
                  className={`hidden size-2 shrink-0 rounded-full sm:block ${p.status === "Active" ? "bg-ok" : "bg-line-strong"}`}
                  aria-hidden="true"
                />
                {p.title}
              </h3>
              <p className="col-start-2 line-clamp-2 text-sm leading-relaxed text-muted sm:col-start-auto sm:text-base">
                {p.blurb}
                <span className="sr-only"> Status: {p.status}.</span>
              </p>
              <ul className="hidden gap-x-3 font-mono text-xs text-faint lg:flex" aria-label="Built with">
                {p.tags.slice(0, 3).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ArrowUpRight
                aria-hidden="true"
                className="col-start-3 row-span-2 row-start-1 size-5 text-faint transition-[transform,color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink sm:col-start-auto sm:row-span-1 sm:row-start-auto"
              />
            </Link>
          </li>
        ))}
      </ul>

      {finePointer && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
        >
          <div
            className={`relative h-44 w-72 overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/40 ring-1 ring-black/10 transition-[opacity,scale] duration-200 ease-out ${
              hovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            {projects.map((p) => (
              <img
                key={p.slug}
                src={p.thumb}
                alt=""
                className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-150 ${
                  hovered?.slug === p.slug ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
