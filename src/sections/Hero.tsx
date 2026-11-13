import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery, useScrollVar } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";
import avatar from "@/assets/new-avatar.jpg?w=600&format=webp";
import avatarSet from "@/assets/new-avatar.jpg?as=srcset&w=300;600;900&format=webp";

const shift = (amount: string): CSSProperties => ({ transform: `translate3d(calc(var(--p) * ${amount}), 0, 0)` });

export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const scrollRef = useScrollVar<HTMLElement>("page");
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section
      ref={scrollRef}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16"
      style={{ "--p": 0 } as CSSProperties}
    >
      <ShaderBackdrop className="absolute inset-0 -z-10" />

      <div className="wrap flex flex-1 flex-col justify-center pb-6 pt-2 md:pb-10">
        {/* As the page scrolls, the portrait zooms and the lines slide apart. */}
        <div className="flex flex-col items-center">
          <div
            className={`w-[min(52vw,28svh)] overflow-hidden rounded-[1.25rem] transition-[clip-path,transform] duration-[1300ms] ease-out md:w-[min(24vw,40svh)] ${
              ready ? "[clip-path:inset(0_0_0_0_round_1.25rem)]" : "translate-y-8 [clip-path:inset(100%_0_0_0_round_1.25rem)]"
            }`}
          >
            <img
              src={avatar}
              srcSet={avatarSet}
              sizes="(min-width: 768px) 24vw, 52vw"
              alt="Portrait of Aawaiz Soomro"
              width={600}
              height={750}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover will-change-transform"
              style={{ transform: "scale(calc(1.02 + var(--p) * 0.45))" }}
            />
          </div>

          <h1 className="relative -mt-[19vw] w-full md:-mt-[8.5vw]">
            {nameLines.map((line, i) => (
              <FitLine key={line} text={line} show={ready} delay={250 + i * 160} style={shift(i % 2 ? "22vw" : "-22vw")} />
            ))}
            <FitLine
              text={PROFILE.titles[2]}
              outline
              show={ready}
              delay={650}
              className="mt-[1.5vw] md:mt-[0.6vw]"
              style={shift(wide ? "22vw" : "-30vw")}
            />
          </h1>
        </div>

        <Fade show={ready} delay={1100} className="mt-5 flex flex-col gap-4 md:mt-8 md:flex-row md:items-end md:justify-between">
          <p className="text-lg leading-snug sm:text-xl">
            CS student at NUCES-FAST.
            <br />
            <span className="font-mono text-base text-muted">
              Currently hacking on <span className="text-accent">{status}</span>
              <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent motion-safe:animate-blink" />
            </span>
          </p>
          <a
            href="#projects"
            onClick={(e) => {
              if (scrollToSection("projects")) e.preventDefault();
            }}
            className="group inline-flex h-12 items-center gap-3 self-start rounded-full bg-accent pl-6 pr-2 font-medium text-on-accent transition-transform duration-200 ease-out active:scale-90 md:self-auto"
          >
            See my work
            <span className="grid size-8 place-items-center rounded-full bg-on-accent text-accent motion-safe:animate-bounce">
              <ArrowDown className="size-4" />
            </span>
          </a>
        </Fade>
      </div>
    </section>
  );
}
