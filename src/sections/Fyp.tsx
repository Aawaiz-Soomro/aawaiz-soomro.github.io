import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Github } from "lucide-react";
import { Fade, SectionHead } from "@/components/Reveal";
import { PROJECTS } from "@/data/projects";
import { RESEARCH } from "@/data/research";
import { withBase } from "@/data/links";

export default function Fyp() {
  const paper = RESEARCH[0];
  const project = PROJECTS.find((p) => p.featured);
  if (!paper || !project) return null;

  return (
    <section id="fyp" aria-labelledby="fyp-title" className="border-y border-line-strong bg-surface py-20 sm:py-28">
      <div className="wrap">
        <SectionHead
          index="03"
          id="fyp-title"
          title="FYP"
          note={
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
              Final year project · paper {paper.status?.toLowerCase()}
            </span>
          }
        />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em]">{paper.title}</h3>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{project.blurb}</p>

            {project.stats && (
              <dl className="mt-10 grid grid-cols-3 border-l border-t border-line-strong">
                {project.stats.map((s, i) => (
                  <Fade key={s.label} delay={i * 80} className="border-b border-r border-line-strong p-4 sm:p-6">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="display text-[clamp(2.25rem,5vw,4.5rem)] text-accent">{s.value}</dd>
                    <dd className="mt-2 font-mono text-[11px] uppercase leading-snug tracking-[0.06em] text-muted">{s.label}</dd>
                  </Fade>
                ))}
              </dl>
            )}

            <dl className="mt-8 grid grid-cols-[7rem_1fr] gap-y-2 font-mono text-xs uppercase tracking-[0.06em]">
              <dt className="text-faint">Team</dt>
              <dd>{paper.members?.join(", ")}</dd>
              <dt className="text-faint">Supervisor</dt>
              <dd>{paper.supervisor}</dd>
              <dt className="text-faint">Venue</dt>
              <dd>
                {paper.outlet}, {paper.date}
              </dd>
              <dt className="text-faint">Stack</dt>
              <dd className="normal-case tracking-normal">{project.tags.join(", ")}</dd>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
              {paper.href && (
                <a
                  href={withBase(paper.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-mono text-xs font-medium uppercase tracking-[0.08em] text-on-accent transition-transform duration-200 ease-out active:scale-95"
                >
                  <FileText className="size-4" /> Read the paper
                </a>
              )}
              <Link
                to={`/projects/${project.slug}`}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Project page
                <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              {project.links?.code && (
                <a
                  href={project.links.code}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong px-6 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <Github className="size-4" /> Code
                </a>
              )}
            </div>
          </div>

          {paper.thumb && (
            <Fade>
              <a
                href={withBase(paper.href)}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the paper (PDF)"
                className="paper-grid group relative grid place-items-center overflow-hidden rounded-[1.75rem] p-8 sm:p-12"
              >
                <img
                  src={withBase(paper.thumb)}
                  alt=""
                  loading="lazy"
                  className="w-[min(100%,24rem)] rotate-[-5deg] shadow-2xl shadow-black/40 ring-1 ring-black/10 transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-paper-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                  fyp_paper.pdf
                </span>
              </a>
            </Fade>
          )}
        </div>
      </div>
    </section>
  );
}
