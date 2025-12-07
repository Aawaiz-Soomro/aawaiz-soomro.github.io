import { useState, useEffect } from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { EDUCATION } from "@/data/education";
import { ChevronDown, ChevronUp, Calendar, MapPin, GraduationCap } from "lucide-react";

export default function Education() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // On desktop, expand current items by default
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      const currentIndices = new Set<number>();
      EDUCATION.forEach((edu, i) => {
        const date = edu.date.toLowerCase();
        if (date.includes('present') || edu.date.includes('2026')) {
          currentIndices.add(i);
        }
      });
      setExpandedCards(currentIndices);
    }
  }, []);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const isCurrent = (date: string) => date.toLowerCase().includes('present') || date.includes('2026');

  return (
    <Section id="education" className="py-12 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Education</h2>

        {/* Timeline container */}
        <div className="mt-10 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] md:left-[23px] top-2 bottom-2 w-0.5 bg-accent-yellow/40" />

          {/* Education items */}
          <div className="space-y-5 md:space-y-6">
            {EDUCATION.map((edu, idx) => {
              const isExpanded = expandedCards.has(idx);
              const current = isCurrent(edu.date);
              const hasDetails = edu.details && edu.details.length > 0;

              return (
                <div key={idx} className="relative pl-10 md:pl-14">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-4 flex items-center justify-center w-8 md:w-12 h-8 md:h-12 rounded-full ${current ? 'bg-accent-yellow/15' : 'bg-transparent'}`}>
                    <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 ${current ? 'bg-accent-yellow border-accent-yellow shadow-[0_0_12px_rgba(250,204,21,0.6)]' : 'bg-panel border-accent-yellow/50'}`} />
                  </div>

                  {/* Card - current cards have deeper shadows */}
                  <div className={`rounded-xl bg-panel border border-border md:hover:border-accent-yellow transition-all md:hover:-translate-y-0.5 ${current ? 'shadow-[0_4px_30px_rgba(0,0,0,0.6)]' : 'shadow-[0_2px_16px_rgba(0,0,0,0.35)]'}`}>

                    {/* Mobile: Clickable card */}
                    <button
                      onClick={() => toggleCard(idx)}
                      className="md:hidden w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold">{edu.school}</h3>
                          <p className="text-sm text-accent-yellow mt-1.5">{edu.degree}</p>

                          {/* Date with icon */}
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-subtext/70">
                            <Calendar className="size-3.5" />
                            <span>{edu.date}</span>
                          </div>
                        </div>
                        {hasDetails && (
                          <ChevronDown className={`size-4 text-subtext/50 transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </button>

                    {/* Mobile: Expandable content */}
                    {hasDetails && (
                      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-4 pb-4">
                          <ul className="space-y-2.5">
                            {edu.details!.map((d, i) => {
                              if (typeof d === "string") {
                                return (
                                  <li key={i} className="flex gap-2 text-[13px] text-subtext/80 leading-relaxed">
                                    <span className="text-accent-yellow mt-0.5">•</span>
                                    <span>{d}</span>
                                  </li>
                                );
                              }
                              return (
                                <li key={i} className="text-[13px] text-subtext/80 leading-relaxed">
                                  <span className="font-semibold text-subtext">{d.title}:</span>
                                  <ul className="mt-1.5 space-y-1.5 ml-4">
                                    {d.points.map((point, j) => (
                                      <li key={j} className="flex gap-2">
                                        <span className="text-accent-yellow">›</span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Desktop: Header always visible, content respects expand state */}
                    <div className="hidden md:block p-5">
                      <button
                        onClick={() => toggleCard(idx)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{edu.school}</h3>
                            <p className="text-sm text-accent-yellow mt-1">{edu.degree}</p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-subtext/70">
                              <Calendar className="size-3.5" />
                              <span>{edu.date}</span>
                            </div>
                          </div>
                          {hasDetails && (
                            <ChevronDown className={`size-4 text-subtext/50 transition-transform duration-200 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </button>

                      {/* Expandable content on desktop */}
                      {hasDetails && (
                        <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          <ul className="space-y-1.5">
                            {edu.details!.map((d, i) => {
                              if (typeof d === "string") {
                                return (
                                  <li key={i} className="flex gap-2 text-sm text-subtext/80 leading-relaxed">
                                    <span className="text-accent-yellow">•</span>
                                    <span>{d}</span>
                                  </li>
                                );
                              }
                              return (
                                <li key={i} className="text-sm text-subtext/80 leading-relaxed mt-3">
                                  <span className="font-semibold text-subtext">{d.title}:</span>
                                  <ul className="mt-1.5 space-y-1 ml-4">
                                    {d.points.map((point, j) => (
                                      <li key={j} className="flex gap-2">
                                        <span className="text-accent-yellow">›</span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
