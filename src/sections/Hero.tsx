import { ArrowDown } from "lucide-react";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";
import avatar from "@/assets/new-avatar.jpg?w=600&format=webp";
import avatarSet from "@/assets/new-avatar.jpg?as=srcset&w=300;600;900&format=webp";

export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const status = useGlitchCycle(PROFILE.status);
  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <ShaderBackdrop className="absolute inset-0 -z-10" />

      <div className="wrap flex flex-1 flex-col justify-center pb-6 pt-2 md:pb-10">
        {/* The portrait, with the name set across it. */}
        <div className="flex flex-col items-center">
          <div
            className={`w-[min(62vw,34svh)] overflow-hidden rounded-[1.25rem] transition-[clip-path,transform] duration-[1200ms] ease-out md:w-[min(25vw,42svh)] ${
              ready ? "[clip-path:inset(0_0_0_0_round_1.25rem)]" : "translate-y-6 [clip-path:inset(100%_0_0_0_round_1.25rem)]"
            }`}
          >
            <img
              src={avatar}
              srcSet={avatarSet}
              sizes="(min-width: 768px) 25vw, 62vw"
              alt="Portrait of Aawaiz Soomro"
              width={600}
              height={750}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <h1 className="relative -mt-[21vw] w-full md:-mt-[8.5vw]">
            {nameLines.map((line, i) => (
              <FitLine key={line} text={line} kinetic show={ready} delay={250 + i * 100} />
            ))}
          </h1>
        </div>

        <Fade show={ready} delay={700} className="mt-6 flex flex-col gap-5 md:mt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="max-w-md text-lg leading-snug sm:text-xl">{PROFILE.intro}</p>
            <p className="mt-3 font-mono text-sm text-muted">
              Currently hacking on <span className="text-accent">{status}</span>
            </p>
          </div>
          <a
            href="#projects"
            onClick={(e) => {
              if (scrollToSection("projects")) e.preventDefault();
            }}
            className="group inline-flex h-12 items-center gap-2 self-start rounded-full bg-accent px-6 font-medium text-on-accent transition-transform duration-200 ease-out active:scale-95 md:self-auto"
          >
            See my projects
            <ArrowDown className="size-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
          </a>
        </Fade>
      </div>
    </section>
  );
}
