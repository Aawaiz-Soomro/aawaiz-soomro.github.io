import React, { useMemo, useRef, useState, useEffect } from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { RESEARCH } from "@/data/research";
import { ExternalLink, Github, Sparkles, Brain, Award, Calendar, GraduationCap, Users, UserCheck } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-xl border border-border bg-bg/50 aspect-video md:aspect-auto w-full md:w-72 lg:w-80 shrink-0 md:h-full transition-all duration-500">
            {hovering && previewVideo ? (
                <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
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
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    src={withBase(thumb)}
                    alt={`${title} thumbnail`}
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/30 p-6 text-center">
                    <div className="relative flex items-center justify-center">
                        <div className="relative rounded-2xl bg-panel p-4 shadow-sm ring-1 ring-white/5">
                            <Brain className="size-8 text-subtext/50" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-subtext/80">In Progress</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProjectInfo({ outlet, members, supervisor }: { outlet?: string, members?: string[], supervisor?: string }) {
    return (
        <div className="text-sm text-subtext/80">
            <div className="flex flex-col gap-5">
                {outlet && (
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-subtext/75">
                            <span>UNI:</span>
                        </div>
                        <div className="text-base text-text/90">
                            {outlet}
                        </div>
                    </div>
                )}

                {members && members.length > 0 && (
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-subtext/75">
                            <span>Members:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-base text-text/90">
                            {members.map((name, i) => {
                                const isAawaiz = /Aawaiz/i.test(name);
                                return (
                                    <span
                                        key={`${name}-${i}`}
                                        className={isAawaiz ? "text-accent-red font-semibold" : ""}
                                    >
                                        {name}{i < members.length - 1 && ","}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {supervisor && (
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-subtext/75">
                            <span>Supervised by:</span>
                        </div>
                        <div className="text-base text-text/90">
                            {supervisor}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Research() {
    const items = useMemo(() => RESEARCH, []);
    const empty = items.length === 0;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <Section id="research" className="py-20 md:py-32 relative">
            <Container>
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Final Year Project
                    </h2>
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
                                className="group relative isolate flex flex-col md:flex-row gap-8 lg:gap-12 rounded-2xl border border-border bg-panel p-6 shadow-sm transition-all duration-300 hover:border-accent-red md:p-8"
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Visual Preview */}
                                {p.href ? (
                                    <a href={p.href} target="_blank" rel="noreferrer" className="flex shrink-0">
                                        <MediaPreview
                                            title={p.title}
                                            thumb={p.thumb}
                                            previewVideo={p.previewVideo}
                                            hovering={hoveredIndex === idx}
                                        />
                                    </a>
                                ) : (
                                    <MediaPreview
                                        title={p.title}
                                        thumb={p.thumb}
                                        previewVideo={p.previewVideo}
                                        hovering={hoveredIndex === idx}
                                    />
                                )}

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">


                                    {p.href ? (
                                        <a href={p.href} target="_blank" rel="noreferrer" className="w-fit">
                                            <h3 className="text-xl font-bold tracking-tight text-text sm:text-2xl group-hover:text-accent-red transition-colors duration-300">
                                                {p.title}
                                            </h3>
                                        </a>
                                    ) : (
                                        <h3 className="text-xl font-bold tracking-tight text-text sm:text-2xl group-hover:text-accent-red transition-colors duration-300">
                                            {p.title}
                                        </h3>
                                    )}



                                    {p.code && (
                                        <div className="flex flex-wrap items-center gap-4">
                                            <a
                                                className="inline-flex items-center gap-2 rounded-lg border border-input bg-transparent px-5 py-2 text-sm font-medium text-text transition-colors hover:bg-accent-red/5 hover:text-accent-red hover:border-accent-red/30"
                                                href={p.code}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Github className="size-4" />
                                                <span>View Source</span>
                                            </a>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <ProjectInfo
                                            outlet={p.outlet}
                                            members={p.members}
                                            supervisor={p.supervisor}
                                        />
                                    </div>

                                    <div className="mt-auto flex flex-wrap items-center gap-3">
                                        {p.status === "Under Review" && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                Under Review
                                            </span>
                                        )}

                                        {p.date && (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-subtext/60">
                                                <Calendar className="size-3" />
                                                {p.date}
                                            </span>
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
