import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/Reveal";
import { PROJECTS, type Project } from "@/data/projects";
import { CARD_COLORS } from "@/data/palette";
import { useReducedMotion } from "@/lib/hooks";


/*
 * Cards pin under the header and stack: each new card slides over the last,
 * which shrinks back and dims.
 */
export default function Projects() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const items = Array.from(listRef.current!.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      items.forEach((li, i) => {
        const card = li.firstElementChild as HTMLElement;
        const next = items[i + 1];
        const r = li.getBoundingClientRect();
        const q = next ? Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - r.top) / r.height)) : 0;
        card.style.transform = `scale(${1 - q * 0.08}) rotate(${q * (i % 2 ? 1.5 : -1.5)}deg)`;
        card.style.filter = `brightness(${1 - q * 0.45})`;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [reduced]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="projects-title" title="Projects" />
        <ol ref={listRef}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className="sticky mb-5 sm:mb-8" style={{ top: `calc(4.75rem + ${i * 8}px)` }}>
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      className="group grid min-h-[min(64svh,34rem)] origin-top gap-4 rounded-[2rem] p-4 text-paper-ink will-change-transform active:brightness-95 sm:p-6 md:min-h-[27rem] md:grid-cols-2 md:gap-8"
      style={{ backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }}
    >
      <div className="grid min-h-40 place-items-center overflow-hidden rounded-3xl bg-white/65 md:order-2">
        {p.thumb && (
          <img
            src={p.thumb}
            srcSet={p.imageSrcSet}
            sizes="(min-width: 768px) 45vw, 90vw"
            alt=""
            loading="lazy"
            className="max-h-56 w-full object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 md:max-h-80"
          />
        )}
      </div>
      <div className="flex flex-col px-1 pb-1">
        <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.08em]">
          <span>
            {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </span>
          <span>{p.status}</span>
        </p>
        <h3 className="display mt-4 text-[clamp(2.75rem,7vw,5.5rem)]">{p.title}</h3>
        <p className="mt-3 line-clamp-2 max-w-md text-lg leading-snug text-paper-ink/80">{p.blurb}</p>
        <p className="mt-auto flex items-end justify-between gap-4 pt-5">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-paper-ink/70">{p.tags.slice(0, 3).join(" / ")}</span>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper-ink text-white transition-transform duration-500 ease-out group-hover:rotate-45 group-active:rotate-45">
            <ArrowUpRight className="size-5" />
          </span>
        </p>
      </div>
    </Link>
  );
}
