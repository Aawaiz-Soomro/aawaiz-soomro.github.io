import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/*
 * One line of display type scaled to fill its container's width.
 * Letters swing up one by one. With a mouse they thin out under the pointer;
 * on touch screens a ripple runs through them instead.
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
  const [onScreen, setOnScreen] = useState(false);

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

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(wrapRef.current!);
    return () => io.disconnect();
  }, []);

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

  const wave = show && onScreen && !finePointer;

  return (
    <span ref={wrapRef} className={`-my-[0.08em] block w-full overflow-hidden py-[0.08em] ${className}`} style={style}>
      <span
        ref={innerRef}
        className={`display inline-block whitespace-nowrap ${outline ? "outline-text" : ""} ${show ? "letters-in" : ""} ${wave ? "wave" : ""}`}
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
