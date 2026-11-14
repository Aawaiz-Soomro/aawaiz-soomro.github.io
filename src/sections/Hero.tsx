import { useRef } from "react";
import FitLine from "@/components/FitLine";
import PortraitField from "@/components/PortraitField";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery } from "@/lib/hooks";

/* My face in dots above my name. The dots assemble, turn, and react to touch. */
export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const touch = !useMediaQuery("(hover: hover) and (pointer: fine)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section id="top" aria-label="Introduction" className="relative flex h-[100svh] min-h-[34rem] touch-pan-y flex-col overflow-hidden pt-16">
      <PortraitField active={ready} floorRef={nameRef} />

      <Fade show={ready} delay={1800} className="wrap pointer-events-none relative flex items-center justify-between pt-4 font-mono text-xs text-muted sm:text-sm">
        <p>
          hacking on <span className="text-accent">{status}</span>
          <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-accent motion-safe:animate-blink" />
        </p>
        <p>{touch ? "touch the dots" : "move, then click"}</p>
      </Fade>

      <div className="wrap pointer-events-none relative mt-auto pb-4 sm:pb-6">
        <h1 ref={nameRef}>
          {nameLines.map((line, i) => (
            <FitLine key={line} text={line} show={ready} delay={900 + i * 220} />
          ))}
          <FitLine text={PROFILE.titles[2]} outline show={ready} delay={1400} className="mt-[1.5vw] md:mt-[0.6vw]" />
        </h1>
      </div>
    </section>
  );
}
