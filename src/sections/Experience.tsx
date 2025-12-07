import { useMemo, useState, useEffect } from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { EXPERIENCES } from "@/data/experience";
import { ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react'

export default function Experience() {
  const [showAll, setShowAll] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  // On desktop, expand current items by default
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      const currentIndices = new Set<number>();
      EXPERIENCES.forEach((exp, i) => {
        if (exp.date.toLowerCase().includes('present')) {
          currentIndices.add(i);
        }
      });
      setExpandedCards(currentIndices);
    }
  }, []);

  const items = useMemo(() => {
    return EXPERIENCES
  }, [])

  const displayedItems = useMemo(() => {
    if (showAll) return items
    return items.slice(0, 3)
  }, [items, showAll])

  const hasMoreItems = items.length > 3

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const isCurrent = (date: string) => date.toLowerCase().includes('present')

  return (
    <Section id="experience" className="py-12 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Experience</h2>

        {/* Timeline container */}
        <div className="mt-10 relative">
          {/* Vertical timeline line - more visible */}
          <div className="absolute left-[15px] md:left-[23px] top-2 bottom-2 w-0.5 bg-accent-green/40" />

          {/* Experience items */}
          <div className="space-y-5 md:space-y-6">
            {displayedItems.map((exp, i) => {
              const isExpanded = expandedCards.has(i)
              const current = isCurrent(exp.date)

              return (
                <div key={i} className="relative pl-10 md:pl-14">
                  {/* Timeline dot - improved visibility */}
                  <div className={`absolute left-0 top-4 flex items-center justify-center w-8 md:w-12 h-8 md:h-12 rounded-full ${current ? 'bg-accent-green/15' : 'bg-transparent'}`}>
                    <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 ${current ? 'bg-accent-green border-accent-green shadow-[0_0_12px_rgba(45,212,191,0.6)]' : 'bg-panel border-accent-green/50'}`} />
                  </div>

                  {/* Card - current cards have deeper shadows */}
                  <div className={`rounded-xl bg-panel border border-border md:hover:border-accent-green transition-all md:hover:-translate-y-0.5 ${current ? 'shadow-[0_4px_30px_rgba(0,0,0,0.6)]' : 'shadow-[0_2px_16px_rgba(0,0,0,0.35)]'}`}>

                    {/* Mobile: Clickable card */}
                    <button
                      onClick={() => toggleCard(i)}
                      className="md:hidden w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold">{exp.role}</h3>
                          <p className="text-sm text-accent-green mt-1.5">{exp.org}</p>

                          {/* Date with icon */}
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-subtext/70">
                            <Calendar className="size-3.5" />
                            <span>{exp.date}</span>
                          </div>

                          {/* Location with icon */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-subtext/70">
                            <MapPin className="size-3.5" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                        <ChevronDown className={`size-4 text-subtext/50 transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Mobile: Expandable content */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 pb-4">
                        {exp.details?.length > 0 && (
                          <ul className="mt-3 space-y-2.5">
                            {exp.details.map((detail, idx) => (
                              <li key={idx} className="flex gap-2 text-[13px] text-subtext/80 leading-relaxed">
                                <span className="text-accent-green mt-0.5">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {(exp.skills?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {exp.skills?.map((skill, idx) => (
                              <span key={idx} className="px-2.5 py-1 text-[10px] rounded-full bg-accent-green/10 text-accent-green/90">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop: Header always visible, content respects expand state */}
                    <div className="hidden md:block p-5">
                      <button
                        onClick={() => toggleCard(i)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{exp.role}</h3>
                            <p className="text-sm text-accent-green mt-1">{exp.org}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-subtext/70">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                {exp.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="size-3.5" />
                                {exp.location}
                              </span>
                            </div>
                          </div>
                          <ChevronDown className={`size-4 text-subtext/50 transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Expandable content on desktop */}
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        {exp.details?.length > 0 && (
                          <ul className="space-y-1.5">
                            {exp.details.map((detail, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-subtext/80 leading-relaxed">
                                <span className="text-accent-green">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {(exp.skills?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.skills?.map((skill, idx) => (
                              <span key={idx} className="px-2.5 py-1 text-[11px] rounded-full bg-accent-green/10 text-accent-green/90">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* See More Button */}
        {hasMoreItems && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border/50 px-6 py-2.5 text-sm font-medium text-subtext transition-all hover:border-accent-green hover:text-accent-green w-full sm:w-auto"
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
    </Section>
  );
}