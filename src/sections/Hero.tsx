import { ArrowDown } from "lucide-react";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

/* A short statement up top, the name across the bottom, the backdrop in between. */
export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section id="top" aria-label="Introduction" className="flex min-h-[100svh] flex-col pt-16">
      <div className="wrap flex flex-1 flex-col pb-5 md:pb-8">
        <Fade show={ready} delay={1400} className="mt-[9svh] max-w-[22rem] md:ml-[58%] md:mt-[15svh]">
          <p className="text-lg font-medium leading-snug sm:text-xl">{PROFILE.intro}</p>
          <a
            href="#projects"
            onClick={(e) => {
              if (scrollToSection("projects")) e.preventDefault();
            }}
            className="group mt-5 inline-flex items-center gap-2 border-b border-accent pb-1 text-accent"
          >
            See my work
            <ArrowDown className="size-4 transition-transform duration-300 ease-out group-hover:translate-y-1" />
          </a>
        </Fade>

        <div className="mt-auto">
          <Fade
            show={ready}
            delay={1400}
            className="mb-3 flex items-baseline justify-between gap-4 border-b border-line-strong pb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted"
          >
            <span className="hidden sm:inline">Karachi, PK</span>
            <span className="sm:text-right">
              Currently hacking on <span className="normal-case text-accent">{status}</span>
            </span>
          </Fade>
          <h1>
            {nameLines.map((line, i) => (
              <FitLine key={line} text={line} show={ready} delay={150 + i * 220} />
            ))}
            <FitLine text={PROFILE.titles[2]} outline show={ready} delay={650} className="mt-[1.5vw] md:mt-[0.6vw]" />
          </h1>
        </div>
      </div>
    </section>
  );
}
