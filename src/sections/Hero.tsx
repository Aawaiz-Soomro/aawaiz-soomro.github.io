import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import FitLine from "@/components/FitLine";
import Signature from "@/components/Signature";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { CREAM, PALETTE } from "@/data/palette";
import { useGlitchCycle, useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";
import avatar from "@/assets/new-avatar.jpg?w=160&format=webp&quality=80";

const COLORS = [...PALETTE, CREAM];

/*
 * The hero is one block from the same family as the project cards. It repaints
 * itself: a new colour floods out from a point, on its own every few seconds
 * and from wherever you tap or click.
 */
export default function Hero() {
  const ready = useReady();
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const touch = !useMediaQuery("(hover: hover) and (pointer: fine)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const cardRef = useRef<HTMLDivElement>(null);
  const [base, setBase] = useState(0);
  const [wipe, setWipe] = useState<{ to: number; x: number; y: number } | null>(null);
  // If the opening played, the signature is already "written"; otherwise write it now.
  const [hadIntro] = useState(!ready);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const busy = useRef(false);
  const baseRef = useRef(0);

  const repaint = useCallback((x: number, y: number) => {
    if (busy.current) return;
    busy.current = true;
    setWipe({ to: (baseRef.current + 1) % COLORS.length, x, y });
  }, []);

  const finish = () => {
    if (!wipe) return;
    baseRef.current = wipe.to;
    setBase(wipe.to);
    setWipe(null);
    busy.current = false;
  };

  // Repaint on its own while the hero is on screen.
  useEffect(() => {
    if (!ready || reduced) return;
    const id = window.setInterval(() => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 120 || document.hidden) return;
      repaint(15 + Math.random() * 70, 10 + Math.random() * 45);
    }, 4200);
    return () => clearInterval(id);
  }, [ready, reduced, repaint]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("a,button")) return;
    const r = cardRef.current!.getBoundingClientRect();
    repaint(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  };

  const nameLines = wide ? ["Aawaiz Soomro"] : ["Aawaiz", "Soomro"];

  return (
    <section id="top" aria-label="Introduction" className="px-2 pb-2 pt-[4.5rem] sm:px-4 sm:pb-4">
      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        className="relative flex h-[calc(100svh-5rem)] min-h-[30rem] flex-col overflow-hidden rounded-[2rem] text-paper-ink sm:h-[calc(100svh-5.5rem)]"
        style={{ backgroundColor: COLORS[base] }}
      >
        {wipe && (
          <span
            aria-hidden="true"
            onAnimationEnd={finish}
            className="absolute inset-0 animate-[flood_900ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
            style={{ backgroundColor: COLORS[wipe.to], "--x": `${wipe.x}%`, "--y": `${wipe.y}%` } as CSSProperties}
          />
        )}

        {/* Sits exactly where the opening draws it, so it stays printed when the panel lifts. */}
        <Signature
          draw={hadIntro ? undefined : drawn}
          duration={1800}
          delay={300}
          className="pointer-events-none absolute left-1/2 top-[calc(40svh-4.5rem)] w-[min(74vw,30rem)] -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative flex flex-1 flex-col p-4 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-3">
              <img src={avatar} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
              <span className="leading-tight">
                <span className="block font-medium">CS student, NUCES-FAST</span>
                <span className="block font-mono text-xs">
                  hacking on {status}
                  <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper-ink motion-safe:animate-blink" />
                </span>
              </span>
            </p>
            <a
              href="#projects"
              aria-label="See my work"
              onClick={(e) => {
                if (scrollToSection("projects")) e.preventDefault();
              }}
              className="group grid size-12 shrink-0 place-items-center rounded-full bg-paper-ink text-white transition-transform duration-300 ease-out hover:scale-110 active:scale-90"
            >
              <ArrowDown className="size-5 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
            </a>
          </div>

          <div className="mt-auto">
            <p className="mb-3 flex items-center justify-between border-b border-paper-ink/40 pb-3 font-mono text-xs uppercase tracking-[0.08em]">
              <span>{touch ? "Tap" : "Click"} anywhere to repaint</span>
              <span className="flex gap-1.5" aria-hidden="true">
                {COLORS.map((c, i) => (
                  <span
                    key={c}
                    className={`size-3 rounded-full border border-paper-ink transition-transform duration-300 ${i === base ? "scale-125" : ""}`}
                    style={{ backgroundColor: i === base ? "var(--paper-ink)" : c }}
                  />
                ))}
              </span>
            </p>
            <h1>
              {nameLines.map((line, i) => (
                <FitLine key={line} text={line} show={ready} delay={200 + i * 220} />
              ))}
              <FitLine text={PROFILE.titles[2]} outline show={ready} delay={700} className="mt-[1.5vw] md:mt-[0.6vw]" />
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
