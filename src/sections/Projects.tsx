import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { SectionHead } from "@/components/Reveal";
import { PROJECTS, type Project } from "@/data/projects";

const FILTERS = ["All", "AI", "Personal", "University"] as const;
type Filter = (typeof FILTERS)[number];

const areas = (p: Project) => (Array.isArray(p.area) ? p.area : p.area ? [p.area] : []);
const matches = (p: Project, f: Filter) => f === "All" || areas(p).includes(f);

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const list = PROJECTS.filter((p) => matches(p, filter));

  // Progress bar and arrow state follow the scroll position.
  useEffect(() => {
    const track = trackRef.current!;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      const visible = max > 0 ? track.clientWidth / track.scrollWidth : 1;
      if (barRef.current) {
        barRef.current.style.width = `${visible * 100}%`;
        barRef.current.style.left = `${p * (1 - visible) * 100}%`;
      }
      setEdges({ start: track.scrollLeft < 8, end: track.scrollLeft > max - 8 });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [filter]);

  // Click-and-drag with a mouse; touch uses native scrolling.
  useEffect(() => {
    const track = trackRef.current!;
    let down = false;
    let moved = 0;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) {
        track.style.scrollSnapType = "none";
        track.style.cursor = "grabbing";
        track.scrollLeft = startScroll - dx;
      }
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      track.style.scrollSnapType = "";
      track.style.cursor = "";
    };
    // A drag should not count as a click on the card underneath.
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    track.addEventListener("click", onClick, true);
    return () => {
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      track.removeEventListener("click", onClick, true);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current!;
    const card = track.querySelector("li");
    track.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 20) * 2, behavior: "smooth" });
  };

  const choose = (f: Filter) => {
    setFilter(f);
    trackRef.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="overflow-hidden py-20 sm:py-28">
      <div className="wrap">
        <SectionHead index="02" id="projects-title" title="Projects" note="Things I’ve built. Drag or swipe through them." />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => choose(f)}
                className={`h-10 rounded-full border px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-200 ${
                  filter === f ? "border-accent bg-accent text-on-accent" : "border-line-strong text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f}
                <sup className="ml-1 opacity-70">{PROJECTS.filter((p) => matches(p, f)).length}</sup>
              </button>
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => step(dir)}
                disabled={dir === -1 ? edges.start : edges.end}
                aria-label={dir === -1 ? "Previous projects" : "Next projects"}
                className="grid size-12 place-items-center rounded-full border border-line-strong text-ink transition-[background-color,color,opacity,transform] duration-200 ease-out hover:bg-accent hover:text-on-accent active:scale-90 disabled:pointer-events-none disabled:opacity-30"
              >
                {dir === -1 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(2.5rem,calc((100vw-96rem)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-96rem)/2+2.5rem))]"
      >
        {list.map((p) => (
          <li key={p.slug} className="w-[min(82vw,23.5rem)] shrink-0 snap-start">
            <ProjectCard project={p} index={PROJECTS.indexOf(p) + 1} />
          </li>
        ))}
      </ul>

      <div className="wrap mt-6">
        <div className="relative h-px bg-line-strong">
          <span ref={barRef} className="absolute -top-px h-[3px] rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      draggable={false}
      className="paper-grid group flex h-full select-none flex-col rounded-[1.75rem] p-4 text-paper-ink transition-transform duration-500 ease-out hover:-translate-y-2 hover:-rotate-1"
    >
      <div className="flex items-center justify-between px-1 font-mono text-[11px] uppercase tracking-[0.08em]">
        <span>No. {String(index).padStart(2, "0")}</span>
        <span className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${p.status === "Active" ? "bg-emerald-600" : "bg-paper-ink/40"}`} aria-hidden="true" />
          {p.status}
        </span>
      </div>

      <div className="mt-3 grid h-48 place-items-center overflow-hidden rounded-2xl border border-paper-ink/10 bg-white/60">
        {p.thumb && (
          <img
            src={p.thumb}
            srcSet={p.imageSrcSet}
            sizes="360px"
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
      </div>

      <h3 className="display mt-5 px-1 text-[2.75rem]">{p.title}</h3>
      <p className="mt-3 line-clamp-3 px-1 text-[15px] leading-snug text-paper-ink/75">{p.blurb}</p>

      <div className="mt-auto flex items-end justify-between gap-3 px-1 pt-5">
        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {p.tags.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full border border-paper-ink/25 px-2.5 py-1 font-mono text-[11px]">
              {t}
            </li>
          ))}
        </ul>
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-paper-ink text-accent transition-transform duration-500 ease-out group-hover:rotate-90"
        >
          <Plus className="size-5" />
        </span>
      </div>
    </Link>
  );
}
