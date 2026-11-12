import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { withBase } from "@/data/links";

const getYouTubeVideoId = (input: string) => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  const match = input.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : input;
};

const isVideo = (path: string) => /\.(mp4|webm|mov)$/i.test(path);

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const index = useMemo(() => PROJECTS.findIndex((p) => p.slug === slug), [slug]);
  const project = PROJECTS[index];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project ? `${project.title} · Aawaiz Soomro` : "Aawaiz Soomro";
    return () => {
      document.title = "Aawaiz Soomro · Backend and AI engineer";
    };
  }, [project]);

  if (!project) {
    return (
      <main className="wrap pb-24 pt-40">
        <p className="kicker text-signal">404</p>
        <h1 className="mt-3 font-mono text-5xl font-bold tracking-tight">No project called “{slug}”.</h1>
        <Link to="/#work" className="mt-8 inline-flex items-center gap-2 font-mono text-accent-ink hover:underline">
          <ArrowLeft className="size-4" /> See all projects
        </Link>
      </main>
    );
  }

  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const areas = Array.isArray(project.area) ? project.area : project.area ? [project.area] : [];
  const paragraphs = (project.body ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <main className="pb-0 pt-28 sm:pt-36">
      <article className="wrap">
        <Link
          to="/#work"
          className="group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          ~/work
        </Link>

        <header className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h1 className="font-mono text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-snug text-muted sm:text-2xl">{project.blurb}</p>
          </div>

          <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-3 border-t border-line pt-6 font-mono text-sm">
            {project.status && (
              <>
                <dt className="text-faint">status</dt>
                <dd className="flex items-center gap-2 text-ink">
                  <span className={`size-2 rounded-full ${project.status === "Active" ? "bg-ok" : "bg-line-strong"}`} aria-hidden="true" />
                  {project.status}
                </dd>
              </>
            )}
            {areas.length > 0 && (
              <>
                <dt className="text-faint">type</dt>
                <dd className="text-ink">{areas.join(", ")}</dd>
              </>
            )}
            <dt className="text-faint">stack</dt>
            <dd className="text-ink">{project.tags.join(", ")}</dd>
            {(project.links?.link || project.links?.code) && (
              <>
                <dt className="text-faint">links</dt>
                <dd className="flex flex-wrap gap-4">
                  {project.links?.link && (
                    <a href={project.links.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent-ink hover:underline">
                      Live <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  {project.links?.code && (
                    <a href={project.links.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent-ink hover:underline">
                      Code <Github className="size-3.5" />
                    </a>
                  )}
                </dd>
              </>
            )}
          </dl>
        </header>

        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-white">
          {project.youtubeVideo ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.youtubeVideo)}`}
                title={`${project.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : project.mainVideo ? (
            <video
              className="aspect-video w-full bg-black object-contain"
              muted
              playsInline
              controls
              preload="metadata"
              poster={project.thumb}
              src={withBase(project.mainVideo)}
            />
          ) : project.thumb ? (
            <img
              className="h-[clamp(16rem,45vw,32rem)] w-full object-contain p-6"
              src={project.thumb}
              srcSet={project.imageSrcSet}
              sizes="(min-width: 1400px) 1300px, 100vw"
              alt={`${project.title} logo`}
            />
          ) : null}
        </div>

        {project.stats && (
          <dl className="mt-12 grid grid-cols-3 gap-4 border-y border-line py-8">
            {project.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-[clamp(1.5rem,4vw,3rem)] font-semibold leading-none tracking-tight">{s.value}</dd>
                <dd className="mt-2 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mx-auto mt-14 max-w-[42rem] space-y-6 text-lg leading-[1.7] text-ink/90">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        {project.gallery?.length ? (
          <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {project.gallery.map((g) => (
              <a key={g} href={withBase(g)} target="_blank" rel="noreferrer" className="mb-4 block break-inside-avoid">
                {isVideo(g) ? (
                  <video src={withBase(g)} className="w-full rounded-xl border border-line" muted playsInline controls preload="metadata" />
                ) : (
                  <img src={withBase(g)} alt="" loading="lazy" className="w-full rounded-xl border border-line" />
                )}
              </a>
            ))}
          </div>
        ) : null}
      </article>

      <Link
        to={`/projects/${next.slug}`}
        className="group mt-24 block border-t border-line bg-surface py-14 transition-colors duration-200 hover:bg-raised sm:py-20"
      >
        <div className="wrap flex items-end justify-between gap-6">
          <div>
            <p className="kicker">Next project</p>
            <p className="mt-3 font-mono text-[clamp(2rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.04em] transition-colors group-hover:text-accent-ink">
              {next.title}
            </p>
          </div>
          <ArrowRight className="mb-2 size-8 shrink-0 text-muted transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:text-accent-ink" />
        </div>
      </Link>
    </main>
  );
}
