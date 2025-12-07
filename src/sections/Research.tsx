import React, { useMemo, useRef, useState, useEffect } from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { RESEARCH } from "@/data/research";
import { ExternalLink, Github, Sparkles, Brain, Award, Calendar } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl aspect-video md:aspect-[4/3] lg:aspect-video w-full md:w-72 lg:w-80 shrink-0 bg-black/20 group-hover:shadow-accent-purple/20 transition-all duration-500">
            {hovering && previewVideo ? (
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
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
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={withBase(thumb)}
                    alt={`${title} thumbnail`}
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-accent-purple/10 to-accent-blue/5 p-6 text-center">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 animate-ping rounded-full bg-accent-purple/20 opacity-75 duration-3000" />
                        <div className="relative rounded-2xl bg-bg/50 p-4 shadow-lg backdrop-blur-md ring-1 ring-white/10">
                            <Brain className="size-8 text-accent-purple" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent-purple">In Progress</p>
                        <p className="text-[10px] text-subtext">Visuals coming soon</p>
                    </div>

                    {/* Abstract decorative elements */}
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-accent-blue/10 blur-2xl" />
                    <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-accent-purple/10 blur-2xl" />
                </div>
            )}

            {/* Overlay gradient for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}

function Authors({ authors }: { authors?: string[] | string }) {
    if (!authors) return null;
    const list = Array.isArray(authors)
        ? authors
        : authors.split(/\s*,\s*/).filter(Boolean);

    return (
        <div className="flex flex-wrap items-center gap-2 text-sm text-subtext">
            <span className="font-medium text-subtext/60">Authors:</span>
            {list.map((name, i) => {
                const isAawaiz = /Aawaiz/i.test(name);
                return (
                    <span
                        key={`${name}-${i}`}
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${isAawaiz
                                ? "bg-accent-purple/10 text-accent-purple ring-accent-purple/20"
                                : "bg-subtext/10 text-subtext ring-subtext/20"
                            }`}
                    >
                        {name}
                    </span>
                );
            })}
        </div>
    );
}

export default function Research() {
    const items = useMemo(() => RESEARCH, []);
    const empty = items.length === 0;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Gradient text for the title
    const gradientTitle = (
        <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-blue bg-clip-text text-transparent">
            Final Year Project
        </span>
    );

    return (
        <Section id="research" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-1/4 -z-10 h-96 w-96 translate-x-1/3 rounded-full bg-accent-purple/5 blur-[100px]" />
            <div className="absolute left-0 bottom-1/4 -z-10 h-72 w-72 -translate-x-1/3 rounded-full bg-accent-blue/5 blur-[80px]" />

            <Container>
                <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-text">
                            {gradientTitle}
                        </h2>
                        <p className="max-w-xl text-lg text-subtext">
                            Cutting-edge research and development in AI/ML systems.
                        </p>
                    </div>
                </div>

                {empty ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-black/5 py-20 text-center">
                        <Sparkles className="mb-4 size-10 text-subtext/30" />
                        <p className="text-lg font-medium text-text">No active projects visible</p>
                        <p className="text-subtext">Check back soon for updates.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {items.map((p, idx) => (
                            <div
                                key={`${p.title}-${idx}`}
                                className="group relative isolate flex flex-col md:flex-row gap-6 lg:gap-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.08] to-transparent p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent-purple/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] md:p-8"
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Visual Preview */}
                                <MediaPreview
                                    title={p.title}
                                    thumb={p.thumb}
                                    previewVideo={p.previewVideo}
                                    hovering={hoveredIndex === idx}
                                />

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <div className="mb-4 flex flex-wrap items-center gap-3">
                                        {p.status === "Under Review" && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                Under Review
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue ring-1 ring-inset ring-accent-blue/20">
                                            <Award className="size-3" />
                                            {p.type}
                                        </span>
                                        {p.date && (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-subtext">
                                                <Calendar className="size-3" />
                                                {p.date}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold tracking-tight text-text sm:text-3xl mb-3 group-hover:text-accent-purple transition-colors duration-300">
                                        {p.title}
                                    </h3>

                                    {p.outlet && (
                                        <p className="text-base font-medium text-text/80 mb-4">{p.outlet}</p>
                                    )}

                                    <div className="mb-6">
                                        <Authors authors={p.authors} />
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto flex flex-wrap items-center gap-4">
                                        {(p.href || p.code || p.status === "Under Review") && (
                                            <>
                                                {p.href && (
                                                    <a
                                                        className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent-purple px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                                        href={p.href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <span className="relative z-10 flex items-center gap-2">
                                                            Read Paper
                                                            <ExternalLink className="size-4" />
                                                        </span>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                                                    </a>
                                                )}
                                                {p.code && (
                                                    <a
                                                        className="group/btn inline-flex items-center gap-2 rounded-xl border border-input bg-bg px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-accent-purple/10 hover:text-accent-purple hover:border-accent-purple/30"
                                                        href={p.code}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <Github className="size-4" />
                                                        <span>View Source</span>
                                                    </a>
                                                )}

                                                {!p.href && !p.code && (
                                                    <p className="text-sm italic text-subtext">Publication links will be available soon.</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    );
}
