import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import FitLine from "@/components/FitLine";
import Signature from "@/components/Signature";
import { useReady } from "@/contexts/ReadyContext";
import { PROFILE } from "@/data/links";
import { CREAM, PALETTE } from "@/data/palette";
import { useGlitchCycle, useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

const COLORS = [...PALETTE, CREAM];

/*
 * The hero is one colour block with the signature written across it.
 * It repaints itself every few seconds; a tap or click floods a new colour
 * out from that point and the signature is written again.
 */
export default function Hero() {
  const ready = useReady();
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const status = useGlitchCycle(PROFILE.status, 1800);
  const cardRef = useRef<HTMLDivElement>(null);
  const [base, setBase] = useState(0);
  const [wipe, setWipe] = useState<{ to: number; x: number; y: number } | null>(null);
  const [writing, setWriting] = useState(false);
  const [sigKey, setSigKey] = useState(0);
  const busy = useRef(false);
  const baseRef = useRef(0);

  useEffect(() => {
    if (ready) setWriting(true);
  }, [ready]);

  const repaint = useCallback((x: number, y: number) => {
    if (busy.current) return false;
    busy.current = true;
    setWipe({ to: (baseRef.current + 1) % COLORS.length, x, y });
    return true;
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
      repaint(15 + Math.random() * 70, 15 + Math.random() * 50);
    }, 5000);
    return () => clearInterval(id);
  }, [ready, reduced, repaint]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("a,button")) return;
    const r = cardRef.current!.getBoundingClientRect();
    if (!repaint(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)) return;
    if (reduced) return;
    // Write the signature again.
    setWriting(false);
    setSigKey((k) => k + 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setWriting(true)));
  };

  const roleLines = wide ? [PROFILE.titles[2]] : ["Aspiring", "AI Engineer"];

  return (
    <section id="top" aria-label="Introduction" className="px-2 pb-2 pt-[4.5rem] sm:px-4 sm:pb-4">
      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        className="relative flex h-[calc(100svh-5rem)] min-h-[30rem] cursor-pointer flex-col overflow-hidden rounded-[2rem] text-paper-ink sm:h-[calc(100svh-5.5rem)]"
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

        <div className="relative flex flex-1 flex-col p-4 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs sm:text-sm">
              hacking on {status}
              <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper-ink motion-safe:animate-blink" />
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

          <div className="grid flex-1 place-items-center py-2">
            <Signature
              key={sigKey}
              draw={reduced ? undefined : writing}
              duration={1700}
              delay={150}
              className="max-h-full w-[min(100%,58rem)] -rotate-3"
            />
          </div>

          <h1>
            <span className="sr-only">{PROFILE.name}, </span>
            {roleLines.map((line, i) => (
              <FitLine key={line} text={line} show={ready} delay={900 + i * 200} />
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
