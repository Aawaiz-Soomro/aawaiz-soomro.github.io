import { ArrowDown, BrainCircuit, Hand, Terminal } from "lucide-react";
import FitLine from "@/components/FitLine";
import PortraitField from "@/components/PortraitField";
import Tile, { Corner } from "@/components/Tile";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { BLUE, LILAC, MINT, ORANGE, YELLOW } from "@/data/palette";
import { useGlitchCycle, useMediaQuery } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

/*
 * The hero is a board of the same tiles the rest of the site is built from:
 * name, portrait, role, status and a way in. They tip into place one by one.
 */
export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const touch = !useMediaQuery("(hover: hover) and (pointer: fine)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];
  const label = "font-mono text-[11px] uppercase tracking-[0.08em] sm:text-xs";

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="grid h-[100svh] min-h-[36rem] grid-cols-2 grid-rows-[auto_1fr_auto] gap-2 px-2 pb-2 pt-[4.5rem] sm:gap-3 sm:px-4 sm:pb-4 md:grid-cols-6 md:grid-rows-[1.2fr_1fr]"
    >
      {/* Name */}
      <Tile color={MINT} show={ready} delay={0} lift={false} className="col-span-2 md:col-span-4">
        <div className="flex h-full flex-col justify-between gap-4 p-4 sm:gap-6 sm:p-6">
          <p className={`${label} flex items-center justify-between`}>
            <span>Hi, I’m</span>
            <span>{PROFILE.location}</span>
          </p>
          <h1>
            {nameLines.map((line, i) => (
              <FitLine key={line} text={line} show={ready} delay={450 + i * 220} />
            ))}
          </h1>
        </div>
      </Tile>

      {/* Portrait: ink dots that assemble, sway, and react to touch */}
      <Tile color={LILAC} show={ready} delay={120} lift={false} className="min-h-[11rem] md:col-span-2 md:row-span-2">
        <PortraitField active={ready} />
        <p className={`${label} pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-6 sm:top-6`}>
          <span>{touch ? "Touch me" : "Click me"}</span>
          <Hand className="size-5" aria-hidden="true" />
        </p>
      </Tile>

      {/* Role */}
      <Tile color={YELLOW} show={ready} delay={240} className="md:col-span-2">
        <div className="flex h-full flex-col justify-between gap-3 p-4 sm:p-6">
          <BrainCircuit className="size-7 sm:size-9" aria-hidden="true" />
          <div>
            <p className="display text-[clamp(1.6rem,7.2vw,2.3rem)] md:text-[clamp(2.25rem,3.9vw,4.25rem)]">{PROFILE.titles[2]}</p>
            <p className={`${label} mt-2 opacity-70`}>CS @ NUCES-FAST</p>
            <p className="mt-3 font-mono text-xs md:hidden">
              hacking on {status}
              <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper-ink motion-safe:animate-blink" />
            </p>
          </div>
        </div>
      </Tile>

      {/* Status */}
      <Tile color={BLUE} show={ready} delay={360} className="hidden md:col-span-1 md:block">
        <div className="flex h-full flex-col justify-between gap-3 p-4 sm:p-6">
          <Terminal className="size-7 sm:size-9" aria-hidden="true" />
          <div>
            <p className="display text-[clamp(1.6rem,7.2vw,2.3rem)] md:text-[clamp(1.75rem,2.6vw,3rem)]">Hacking on</p>
            <p className="mt-2 font-mono text-xs sm:text-sm">
              {status}
              <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper-ink motion-safe:animate-blink" />
            </p>
          </div>
        </div>
      </Tile>

      {/* Way in */}
      <Tile color={ORANGE} show={ready} delay={480} className="col-span-2 md:col-span-1">
        <a
          href="#projects"
          onClick={(e) => {
            if (scrollToSection("projects")) e.preventDefault();
          }}
          className="group flex h-full items-center justify-between gap-3 px-4 py-2.5 sm:p-6 md:flex-col md:items-start"
        >
          <Corner className="group-hover:translate-y-1 md:self-end">
            <ArrowDown className="size-5" />
          </Corner>
          <span className="display order-first text-[clamp(1.6rem,7.2vw,2.3rem)] md:order-none md:text-[clamp(1.75rem,2.6vw,3rem)]">See my work</span>
        </a>
      </Tile>
    </section>
  );
}
