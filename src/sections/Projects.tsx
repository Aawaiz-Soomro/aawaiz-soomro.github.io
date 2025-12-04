import React, { useMemo, useRef, useState, useEffect } from 'react'
import Section from '@/components/Section'
import Container from '@/components/Container'
import { PROJECTS } from '@/data/projects'
import { Link } from 'react-router-dom'
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

const withBase = (path?: string) =>
  path ? `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}` : undefined

function Preview({
  title,
  thumb,
  previewVideo,
  hovering,
  objectFit = 'cover',
}: {
  title: string
  thumb?: string
  previewVideo?: string
  hovering: boolean
  objectFit?: "cover",
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (hovering && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => { })
    } else if (!hovering && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [hovering])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-bg">
      {hovering && previewVideo ? (
        <video
          ref={videoRef}
          className="h-44 w-full object-cover md:h-48"
          muted
          playsInline
          loop
          preload="none"
          poster={thumb ? withBase(thumb) : undefined}
          src={withBase(previewVideo)}
          aria-label={`${title} preview`}
        />
      ) : thumb ? (
        <div className="relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-panel animate-pulse h-44 md:h-48" />
          )}
          <img
            className={`h-44 w-full ${objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'} md:h-48 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            src={withBase(thumb)}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center text-subtext md:h-48">
          No preview
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Personal' | 'University' | 'Commercial'
  >('All')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const filters = [
    { label: 'All', value: 'All' as const },
    { label: 'Personal', value: 'Personal' as const },
    { label: 'University', value: 'University' as const },
    { label: 'Commercial', value: 'Commercial' as const },
  ]

  const items = useMemo(() => {
    if (activeFilter === 'All') return PROJECTS
    return PROJECTS.filter((p) => p.area === activeFilter)
  }, [activeFilter])

  const displayedItems = useMemo(() => {
    if (showAll) return items
    return items.slice(0, 6)
  }, [items, showAll])

  const hasMoreItems = items.length > 6

  useEffect(() => {
    const preloadVideos = () => {
      items.forEach((project) => {
        if (project.previewVideo) {
          const video = document.createElement('video')
          video.preload = 'auto'
          video.src = withBase(project.previewVideo) || ''
          video.muted = true
          video.playsInline = true
          video.load()
        }
      })
    }

    preloadVideos()
  }, [items])

  // Reset showAll when filter changes
  useEffect(() => {
    setShowAll(false)
  }, [activeFilter])

  return (
    <Section id="projects" className="py-12 md:py-20">
      <Container>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h2>

          {/* Filter buttons */}
          <div
            className="flex flex-wrap items-center gap-3"
            onMouseLeave={() => setHoveredFilter(null)}
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value && !hoveredFilter
              const isHovered = hoveredFilter === filter.value
              const isHighlighted = isHovered || isActive

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  onMouseEnter={() => setHoveredFilter(filter.value)}
                  className="rounded-xl border px-3 py-1.5 text-sm transition-all duration-300 ease-out"
                  style={{
                    borderColor: isHighlighted ? 'var(--color-accent-purple)' : 'var(--color-border)',
                    color: isHighlighted ? 'var(--color-accent-purple)' : 'var(--color-subtext)'
                  }}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((p, idx) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-panel transition-all hover:border-accent-purple hover:shadow-sm hover:-translate-y-1 cursor-pointer"
              onMouseEnter={() => setHoveredSlug(p.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              <div className="pt-4 px-4">
                <Preview
                  title={p.title}
                  thumb={p.thumb}
                  previewVideo={p.previewVideo}
                  hovering={hoveredSlug === p.slug}
                  objectFit={p.objectFit}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                {/* Title */}
                <h3 className="text-base font-medium text-accent-white transition-all">
                  {p.title}
                </h3>

                <div className="flex-grow">
                  {/* Blurb */}
                  <p className="mt-2 text-sm leading-relaxed text-subtext">
                    {p.blurb}
                  </p>

                  {/* Tags */}
                  {p.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t, i) => {
                        const accents = [
                          'border-accent-purple text-accent-purple',
                          'border-accent-green text-accent-green',
                          'border-accent-red text-accent-red',
                          'border-accent-yellow text-accent-yellow',
                          'border-accent-blue text-accent-blue',
                          'border-accent-cyan text-accent-cyan',
                        ]
                        const style = accents[i % accents.length]
                        return (
                          <span
                            key={t}
                            className={`rounded-full border px-2.5 py-1 text-[11px] ${style} bg-bg`}
                          >
                            {t}
                          </span>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Buttons/Active indicator - anchored to bottom */}
                {(p.links?.link || p.links?.code || p.active || p.status === 'In Progress') && (
                  <div className="mt-4 flex items-center gap-4 items-center">
                    {p.links?.link && (
                      <a
                        href={p.links.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text transition-colors text-accent-white hover:text-accent-purple hover:border-accent-purple cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Link{' '}
                        <ExternalLink className="size-4 transition-transform" />
                      </a>
                    )}
                    {p.links?.code && (
                      <a
                        href={p.links.code}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text transition-colors text-accent-white hover:text-accent-purple hover:border-accent-purple cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Code{' '}
                        <Github className="size-4 transition-transform" />
                      </a>
                    )}

                    {(p.active || p.status === 'Active') && (
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
                        Active
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* See More Button */}
        {hasMoreItems && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-medium text-accent-white transition-all hover:border-accent-purple hover:text-accent-purple hover:shadow-sm"
            >
              {showAll ? 'Show Less' : 'See More'}
              {showAll ? (
                <ChevronUp className="size-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="size-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        )}
      </Container>
    </Section>
  )
}