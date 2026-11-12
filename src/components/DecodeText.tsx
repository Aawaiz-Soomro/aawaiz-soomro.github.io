import { useEffect, useState } from "react";
import { randomGlyph, useReducedMotion } from "@/lib/hooks";

const scramble = (text: string) => text.replace(/\S/g, () => randomGlyph());

/**
 * Text that resolves from random glyphs, left to right, once on mount.
 * Screen readers get the final text immediately.
 */
export default function DecodeText({
  text,
  delay = 0,
  duration = 800,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(() => (reduced ? text : scramble(text)));

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let raf = 0;
    let lastTick = 0;
    const start = performance.now() + delay;
    const step = (now: number) => {
      const t = Math.max(0, (now - start) / duration);
      if (now - lastTick > 45 || t >= 1) {
        lastTick = now;
        const locked = Math.floor(Math.min(1, t) * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          s += i < locked || text[i] === " " ? text[i] : randomGlyph();
        }
        setOut(s);
      }
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration, reduced]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </>
  );
}
