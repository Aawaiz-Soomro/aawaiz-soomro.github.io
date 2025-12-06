import React, { useMemo, useRef, useState, useEffect } from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { RESEARCH } from "@/data/research";
import { ExternalLink, Github, Clock } from "lucide-react";

/** Build a base-aware URL for files in /public */
const withBase = (path?: string) =>
  path ? `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}` : undefined;

function MediaPreview({
  title,
  thumb,
  previewVideo,
  hovering,
}: {
  title: string;
  thumb?: string;
  previewVideo?: string;
  hovering: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (hovering && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    } else if (!hovering && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovering]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg">
      {hovering && previewVideo ? (
        <video
          ref={videoRef}
          className="h-24 w-40 object-cover sm:h-28 sm:w-48 md:h-32 md:w-56 lg:h-36 lg:w-64"
          muted
          playsInline
          loop
          preload="metadata"
          poster={thumb ? withBase(thumb) : undefined}
          src={withBase(previewVideo)}
          aria-label={`${title} preview`}
        />
      ) : thumb ? (
        <img
          className="h-24 w-40 object-cover sm:h-28 sm:w-48 md:h-32 md:w-56 lg:h-36 lg:w-64"
          src={withBase(thumb)}
          alt={`${title} thumbnail`}
          loading="lazy"
        />
      ) : (
        <div className="flex h-24 w-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-subtext/20 bg-accent-purple/5 text-subtext transition-colors hover:border-accent-purple/30 sm:h-28 sm:w-48 md:h-32 md:w-56 lg:h-36 lg:w-64">
          <div className="rounded-full bg-bg p-2 shadow-sm ring-1 ring-border">
            <Clock className="size-4 text-accent-purple/70" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-subtext/70">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}

function formatAuthors(authors?: string[] | string) {
  if (!authors) return null;
  const list = Array.isArray(authors)
    ? authors
    : authors.split(/\s*,\s*/).filter(Boolean);
  return (
    <>
      {list.map((name, i) => {
        const isAawaiz = /Aawaiz/i.test(name);
        return (
          <span key={`${name}-${i}`} className={isAawaiz ? "text-accent-red" : undefined}>
            {name}
            {i < list.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </>
  );
}

export default function Research() {
  const items = useMemo(() => RESEARCH, []);
  const empty = items.length === 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Section id="research" className="py-12 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          FYP
        </h2>

        {empty ? (
          <p className="mt-2 text-subtext">Papers under review — check back soon!</p>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((p, idx) => (
              <article
                key={`${p.title}-${idx}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-panel p-4 transition-all duration-300 hover:border-accent-red md:gap-5 md:p-5 hover:-translate-y-1"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Left: media preview */}
                <MediaPreview
                  title={p.title}
                  thumb={p.thumb}
                  previewVideo={p.previewVideo}
                  hovering={hoveredIndex === idx}
                />

                {/* Right: metadata */}
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <h3 className="text-lg font-medium tracking-tight sm:text-xl transition-all">
                    {p.title}
                  </h3>

                  {/* Citation-like line (authors) */}
                  {p.authors && (
                    <p className="mt-1 text-sm leading-relaxed text-subtext">
                      {formatAuthors(p.authors)}
                    </p>
                  )}

                  {/* Outlet, Date, Type line */}
                  <p className="mt-1 text-sm">
                    {p.outlet && <span className="text-subtext">{p.outlet}</span>}
                    {p.date && <><span className="text-subtext"> • </span><span className="text-accent-red">{p.date}</span></>}
                    <span className="text-subtext"> • </span>
                    <span className="text-accent-red capitalize">{p.type}</span>
                  </p>

                  {/* Links: Paper / Code */}
                  {(p.href || p.code || p.status === "Under Review") && (
                    <div className="mt-3 flex items-center gap-4">
                      {p.href && (
                        <a
                          className="group inline-flex items-center gap-1 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text transition-colors text-accent-white hover:text-accent-red hover:border-accent-red"
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                          <ExternalLink className="size-4 transition-transform" />
                        </a>
                      )}
                      {p.code && (
                        <a
                          className="group inline-flex items-center gap-1 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text transition-colors text-accent-white hover:text-accent-red hover:border-accent-red"
                          href={p.code}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Code
                          <Github className="size-4 transition-transform" />
                        </a>
                      )}

                      {p.status === "Under Review" && (
                        <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-emerald-400 px-2">
                          <span className="relative inline-flex h-2.5 w-2.5">
                            {/* bright core */}
                            <span
                              className="absolute inset-0 rounded-full bg-emerald-400 opacity-100 shadow-[0_0_12px_3px_rgba(16,185,129,0.9)]"
                              aria-hidden
                            />
                            {/* soft halo with enhanced pulse */}
                            <span
                              className="absolute inset-0 rounded-full bg-emerald-400/80 blur-[4px] animate-[pulse_1.5s_ease-in-out_infinite]"
                              aria-hidden
                            />
                          </span>
                          Under Review
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}