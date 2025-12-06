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
  objectFit?: 'contain' | 'cover'
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
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg">
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
            className={`h-44 w-full md:h-48 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${objectFit === 'contain' ? 'object-contain p-4 bg-white brightness-110 contrast-125' : 'object-cover'
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h2>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-all border ${isActive
                    ? 'bg-accent-purple/10 text-accent-purple border-accent-purple'
                    : 'border-transparent text-subtext hover:border-accent-purple hover:text-accent-purple'
                    }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((p) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-panel transition-all duration-300 hover:border-accent-purple cursor-pointer p-5"
              onMouseEnter={() => setHoveredSlug(p.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* Image */}
              <Preview
                title={p.title}
                thumb={p.thumb}
                previewVideo={p.previewVideo}
                hovering={hoveredSlug === p.slug}
                objectFit={p.objectFit}
              />

              {/* Content */}
              <div className="flex flex-1 flex-col mt-4">
                {/* Title */}
                <h3 className="text-lg font-medium text-text mb-3 group-hover:text-accent-purple transition-colors">
                  {p.title}
                </h3>

                {/* Description - 3 lines with increased line height */}
                <p className="text-sm leading-7 text-subtext line-clamp-3 mb-5">
                  {p.blurb}
                </p>

                <div className="flex-grow" />

                {/* Tags - Original colorful style, dynamic single line with ellipsis */}
                {/* Tags - Scrollable/Hidden, no ellipses logic */}
                {p.tags?.length ? (
                  <div className="flex flex-wrap w-full overflow-hidden h-7 gap-2 mb-4">
                    {p.tags.map((t, i) => {
                      const accents = [
                        'border-accent-purple text-accent-purple',
                        'border-accent-green text-accent-green',
                        'border-accent-red text-accent-red',
                        'border-accent-yellow text-accent-yellow',
                        'border-accent-blue text-accent-blue',
                        'border-accent-cyan text-accent-cyan',
                      ]
                      return (
                        <span
                          key={t}
                          className={`whitespace-nowrap rounded-[4px] border px-3 py-1 text-[11px] font-medium ${accents[i % accents.length]} bg-bg`}
                        >
                          {t}
                        </span>
                      )
                    })}
                  </div>
                ) : null}

                {/* Footer - Links and Status */}
                <div className="flex items-center gap-3 mt-auto">
                  {p.links?.link && (
                    <a
                      href={p.links.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-subtext hover:text-accent-purple transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="size-4" />
                      <span>Demo</span>
                    </a>
                  )}
                  {p.links?.code && (
                    <a
                      href={p.links.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-subtext hover:text-accent-purple transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="size-4" />
                      <span>Code</span>
                    </a>
                  )}

                  {(p.active || p.status === 'Active') && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      Active
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See More Button */}
        {hasMoreItems && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm text-text transition-all hover:border-accent-purple hover:text-accent-purple"
            >
              {showAll ? 'Show Less' : 'See More'}
              {showAll ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
          </div>
        )}
      </Container>
    </Section >
  )
}
