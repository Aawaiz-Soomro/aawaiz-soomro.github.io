import { useEffect, useRef, useState } from "react";
import { BLUE, CREAM, LILAC, YELLOW } from "@/data/palette";

const COUNT = 1300;
const LIFT = 700;
const STAGGER = 110;
// Sheets under the dark one; they peel away in this order.
const SHEETS = [CREAM, LILAC, YELLOW, BLUE];

/*
 * Opening: a counter runs to 100, then a deck of colour sheets peels away
 * upward to uncover the page. `onReady` fires as the last sheets leave, so the
 * hero can start; `onDone` fires once everything is gone.
 */
export default function Preloader({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    const timers: number[] = [];
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (t < 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const total = LIFT + SHEETS.length * STAGGER;
      timers.push(window.setTimeout(() => setLeaving(true), 200));
      timers.push(window.setTimeout(onReady, 200 + total - 350));
      timers.push(
        window.setTimeout(() => {
          document.documentElement.style.overflow = "";
          onDone();
        }, 200 + total + 50)
      );
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, [onReady, onDone]);

  const lift = (delay: number) => ({
    transitionDuration: `${LIFT}ms`,
    transitionDelay: `${delay}ms`,
    transform: leaving ? "translateY(-100%)" : "none",
  });

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[80]">
      {SHEETS.map((color, i) => (
        <span
          key={color}
          className="absolute inset-0 transition-transform ease-in-out"
          style={{ backgroundColor: color, zIndex: SHEETS.length - i, ...lift((i + 1) * STAGGER) }}
        />
      ))}
      <div className="absolute inset-0 z-10 grid place-items-center bg-bg transition-transform ease-in-out" style={lift(0)}>
        <span ref={countRef} className="display text-[clamp(8rem,42vw,24rem)] text-ink">
          000
        </span>
      </div>
    </div>
  );
}
