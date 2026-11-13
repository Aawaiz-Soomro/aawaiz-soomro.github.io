import { useEffect, useRef, useState } from "react";
import Signature from "@/components/Signature";

const DRAW = 2100;
const EXIT = 900;

/* Opening: the signature is written out while a counter runs to 100, then the panel lifts. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let raf = requestAnimationFrame(() => setDrawing(true));
    const timers: number[] = [];
    const start = performance.now();
    const total = DRAW + 250;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (t < 1) raf = requestAnimationFrame(frame);
      else {
        timers.push(window.setTimeout(() => setLeaving(true), 350));
        timers.push(
          window.setTimeout(() => {
            document.documentElement.style.overflow = "";
            onDone();
          }, 350 + EXIT)
        );
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[80] bg-bg transition-transform ease-in-out"
      style={{ transitionDuration: `${EXIT}ms`, transform: leaving ? "translateY(-100%)" : "none" }}
    >
      <Signature draw={drawing} duration={DRAW} delay={150} className="absolute left-1/2 top-[40svh] w-[min(74vw,30rem)] -translate-x-1/2 -translate-y-1/2 text-ink" />
      <span ref={countRef} className="display absolute bottom-6 left-4 text-[clamp(4.5rem,13vw,10rem)] text-accent sm:bottom-8 sm:left-8 lg:left-10">
        000
      </span>
    </div>
  );
}
