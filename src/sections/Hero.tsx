import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { useGlitchCycle, useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";
import avatar from "@/assets/new-avatar.jpg?w=600&format=webp";

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 20_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero() {
  const ready = useReady();
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const status = useGlitchCycle(PROFILE.status);
  const time = useClock();
  const cardRef = useRef<HTMLDivElement>(null);

  // The photo card leans toward the pointer.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) rotate(${3 + x * 2}deg)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];
  const roleLines = wide ? ["Aspiring AI Engineer"] : ["Aspiring", "AI Engineer"];

  return (
    <section id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <ShaderBackdrop className="absolute inset-0 -z-10" />

      <div className="wrap flex flex-1 flex-col">
        <Fade show={ready} delay={500} className="flex items-center justify-between pt-6 sm:pt-10">
          <span className="tag text-accent">Portfolio 2026</span>
          <span className="tag text-muted">
            {PROFILE.location} · {time}
          </span>
        </Fade>

        <h1 className="mt-5 sm:mt-6">
          {nameLines.map((line, i) => (
            <FitLine key={line} text={line} kinetic show={ready} delay={i * 90} />
          ))}
          {roleLines.map((line, i) => (
            <FitLine key={line} text={line} outline kinetic show={ready} delay={(nameLines.length + i) * 90} className="mt-[0.5vw]" />
          ))}
        </h1>

        <div className="mt-auto grid items-end gap-8 pb-8 pt-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-10 md:pb-10">
          <Fade show={ready} delay={650}>
            <p className="max-w-md text-lg leading-snug text-ink sm:text-xl">{PROFILE.intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                onClick={(e) => {
                  if (scrollToSection("projects")) e.preventDefault();
                }}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-on-accent transition-transform duration-200 ease-out active:scale-95"
              >
                See projects
                <span className="grid size-8 place-items-center rounded-full bg-on-accent text-accent transition-transform duration-300 ease-out group-hover:translate-y-0.5">
                  <ArrowDown className="size-4" />
                </span>
              </a>
              <a
                href={PROFILE.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center rounded-full border border-line-strong bg-bg/40 px-6 font-mono text-xs uppercase tracking-[0.08em] text-ink backdrop-blur-sm transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Say hi
              </a>
            </div>
          </Fade>

          <Fade show={ready} delay={750} className="hidden md:block">
            <dl className="grid grid-cols-[5rem_1fr] gap-y-2 border-t border-line-strong pt-4 font-mono text-xs uppercase tracking-[0.06em]">
              <dt className="text-faint">Role</dt>
              <dd>{PROFILE.titles.slice(0, 2).join(" / ")}</dd>
              <dt className="text-faint">Base</dt>
              <dd>NUCES-FAST, Karachi</dd>
              <dt className="text-faint">Focus</dt>
              <dd>Backend / Cloud / AI</dd>
              <dt className="text-faint">Status</dt>
              <dd className="flex items-center gap-2 text-accent">
                <span className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" aria-hidden="true" />
                Open to opportunities
              </dd>
            </dl>
          </Fade>

          <Fade show={ready} delay={850} className="justify-self-start md:justify-self-end">
            <div
              ref={cardRef}
              className="w-44 rounded-2xl border border-line-strong bg-surface/80 p-2.5 shadow-2xl shadow-black/50 backdrop-blur-sm transition-transform duration-500 ease-out will-change-transform sm:w-52"
              style={{ transform: "rotate(3deg)" }}
            >
              <img
                src={avatar}
                alt="Aawaiz Soomro"
                width={600}
                height={800}
                fetchPriority="high"
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              <p className="px-1 pb-1 pt-2.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-muted">
                Currently hacking on
                <br />
                <span className="text-sm normal-case tracking-normal text-accent">{status}</span>
                <span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent motion-safe:animate-blink" />
              </p>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
