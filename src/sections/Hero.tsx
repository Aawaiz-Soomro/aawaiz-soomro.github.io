import { ArrowDown } from "lucide-react";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

/** Round badge with text running around it; it turns slowly and links to the work. */
function ScrollBadge() {
  return (
    <a
      href="#projects"
      aria-label="See my work"
      onClick={(e) => {
        if (scrollToSection("projects")) e.preventDefault();
      }}
      className="group relative grid size-28 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-300 ease-out hover:scale-110 active:scale-90 sm:size-36"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 motion-safe:animate-[spin_14s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-current font-mono text-[9.4px] uppercase tracking-[0.22em]">
          <textPath href="#badge-circle">See my work · Scroll down · </textPath>
        </text>
      </svg>
      <ArrowDown className="size-7 transition-transform duration-300 ease-out group-hover:translate-y-1 sm:size-9" />
    </a>
  );
}

export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <ShaderBackdrop className="absolute inset-0 -z-10" />

      <div className="wrap flex flex-1 flex-col pb-6 md:pb-10">
        <div className="flex flex-1 items-center justify-end py-6">
          <Fade show={ready} delay={1500}>
            <ScrollBadge />
          </Fade>
        </div>

        <h1>
          {nameLines.map((line, i) => (
            <FitLine key={line} text={line} show={ready} delay={150 + i * 220} />
          ))}
          <FitLine text={PROFILE.titles[2]} outline show={ready} delay={650} className="mt-[1.5vw] md:mt-[0.6vw]" />
        </h1>

        <Fade show={ready} delay={1500} className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between md:mt-7">
          <p className="text-lg sm:text-xl">CS student at NUCES-FAST, Karachi.</p>
          <p className="font-mono text-sm text-muted sm:text-base">
            Currently hacking on <span className="text-accent">{status}</span>
            <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent motion-safe:animate-blink" />
          </p>
        </Fade>
      </div>
    </section>
  );
}
