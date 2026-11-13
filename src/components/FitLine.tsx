import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/*
 * One line of display type scaled to fill its container's width.
 * Letters rise thin and ink in to full weight, once. After that they react to
 * the pointer on hover, or to a tap on touch screens.
 */
export default function FitLine({
  text,
  outline = false,
  show = true,
  delay = 0,
  className = "",
  style,
}: {
  text: string;
  outline?: boolean;
  show?: boolean;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [phase, setPhase] = useState<"in" | "done">("in");

  useLayoutEffect(() => {
    const wrap = wrapRef.current!;
    const inner = innerRef.current!;
    const fit = () => {
      inner.style.fontSize = "100px";
      const natural = inner.getBoundingClientRect().width;
      if (natural > 0) inner.style.fontSize = `${(100 * wrap.clientWidth) / natural}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text]);

  // After the one-off entrance, hold the final state so nothing replays.
  useEffect(() => {
    if (!show) return;
    const id = window.setTimeout(() => setPhase("done"), delay + text.length * 48 + 1400);
    return () => clearTimeout(id);
  }, [show, delay, text]);

  // On touch screens a tap sends one ripple through the line.
  const ripple = () => {
    if (finePointer || reduced || phase !== "done") return;
    const el = innerRef.current!;
    el.classList.remove("ripple");
    void el.offsetWidth;
    el.classList.add("ripple");
    window.setTimeout(() => el.classList.remove("ripple"), 850 + text.length * 38);
  };

  useEffect(() => {
    if (reduced || !finePointer) return;
    const letters = Array.from(innerRef.current!.querySelectorAll<HTMLElement>("[data-l]"));
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const apply = () => {
      raf = 0;
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const near = Math.exp(-((d / (r.height * 0.9)) ** 2));
        el.style.fontVariationSettings = `"wdth" 62, "wght" ${Math.round(900 - near * 700)}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, finePointer, text]);

  return (
    <span ref={wrapRef} className={`-my-[0.08em] block w-full overflow-hidden py-[0.08em] ${className}`} style={style}>
      <span
        ref={innerRef}
        className={`display inline-block whitespace-nowrap ${outline ? "outline-text" : ""} ${!show ? "" : phase === "done" ? "letters-done" : "letters-in"}`}
        onPointerDown={ripple}
        style={{ "--d": `${delay}ms` } as CSSProperties}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {text.split("").map((ch, i) => (
            <span key={i} data-l className="ltr" style={{ "--i": i } as CSSProperties}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
