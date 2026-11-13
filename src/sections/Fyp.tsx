import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Fade, SectionHead } from "@/components/Reveal";
import { PROJECTS } from "@/data/projects";
import { RESEARCH } from "@/data/research";
import { withBase } from "@/data/links";

const link = "group inline-flex items-center gap-1.5 border-b border-accent pb-0.5 text-lg transition-colors duration-200 hover:text-accent";
const arrow = "size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

export default function Fyp() {
  const paper = RESEARCH[0];
  const project = PROJECTS.find((p) => p.featured);
  if (!paper || !project) return null;

  return (
    <section id="fyp" aria-labelledby="fyp-title" className="bg-surface py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="fyp-title" title="Final year project" />
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.12] tracking-[-0.02em]">{project.blurb}</h3>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Trained on {project.stats?.[0].value} Instagram posts from {project.stats?.[1].value} influencers. Built with{" "}
              {paper.members?.filter((m) => m !== "Aawaiz").join(" and ")}, supervised by {paper.supervisor}. The paper is{" "}
              {paper.status?.toLowerCase()}.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {paper.href && (
                <a href={withBase(paper.href)} target="_blank" rel="noreferrer" className={link}>
                  Read the paper <ArrowUpRight className={arrow} />
                </a>
              )}
              <Link to={`/projects/${project.slug}`} className={link}>
                Project page <ArrowUpRight className={arrow} />
              </Link>
              {project.links?.code && (
                <a href={project.links.code} target="_blank" rel="noreferrer" className={link}>
                  Code <ArrowUpRight className={arrow} />
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
                className="group grid place-items-center overflow-hidden rounded-3xl bg-paper p-8 sm:p-12"
              >
                <img
                  src={withBase(paper.thumb)}
                  alt=""
                  loading="lazy"
                  className="w-[min(100%,22rem)] rotate-[-4deg] shadow-2xl shadow-black/40 transition-transform duration-700 ease-out group-hover:rotate-0 group-hover:scale-105"
                />
              </a>
            </Fade>
          )}
        </div>
      </div>
    </section>
  );
}
