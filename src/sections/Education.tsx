import React from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { EDUCATION } from "@/data/education";
import GTLogo from "@/assets/nu_logo.svg?react";

// simple registry: add more schools by importing and mapping here
const eduLogos = {
  gt: GTLogo,
} as const;

export default function Education() {
  return (
    <Section id="education" className="py-12 md:py-0">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Education
        </h2>

        <div className="mt-8 space-y-6">
          {EDUCATION.map((edu, idx) => {
            const Logo = edu.logoKey ? eduLogos[edu.logoKey] : null;
            const size = edu.logoSize ?? 56;


            return (
              <div
                key={idx}
                className="group rounded-xl border border-border bg-panel p-5 transition-all hover:border-accent-yellow hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {/* Left: logo — left-justified, vertically centered */}
                  {Logo && (
                    <Logo
                      className={
                        "text-subtext transition-colors group-hover:text-accent-yellow"
                      }
                      style={{
                        width: size,
                        height: size,
                      }}
                      aria-hidden
                    />
                  )}
                  {/* Right: content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium">{edu.school}</h3>
                    <p className="text-sm text-accent-yellow">{edu.degree}</p>
                    <p className="text-xs text-subtext">{edu.date}</p>

                    {edu.details?.length ? (
                      <div className="mt-3 text-sm text-subtext space-y-1">
                        {edu.details.map((d, i) => {
                          // CASE 1: simple string bullet (old behavior)
                          if (typeof d === "string") {
                            return (
                              <div key={i} className="leading-relaxed">
                                {d
                                  .split(
                                    /(Concentration:|Coursework:|Activities and Societies:)/
                                  )
                                  .map((part, idx) =>
                                    [
                                      "Concentration:",
                                      "Coursework:",
                                      "Activities and Societies:",
                                    ].includes(part) ? (
                                      <span
                                        key={idx}
                                        className="font-semibold"
                                      >
                                        {part}
                                      </span>
                                    ) : (
                                      part
                                    )
                                  )}
                              </div>
                            );
                          }

                          // CASE 2: group with sub-bullets (Activities & Societies)
                          return (
                            <div key={i} className="leading-relaxed">
                              <span className="font-semibold">
                                {d.title}
                              </span>
                              <ul className="mt-1 ml-4 list-disc">
                                {d.points.map((point, j) => (
                                  <li key={j}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
