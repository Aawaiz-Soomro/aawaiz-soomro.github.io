import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/*
 * One line of display type scaled to fill its container's width.
 * With `kinetic`, letters near the pointer thin out, like a lens passing over.
 */
export default function FitLine({
  text,
  outline = false,
  kinetic = false,
  show = true,
  delay = 0,
  className = "",
}: {
  text: string;
  outline?: boolean;
  kinetic?: boolean;
  show?: boolean;
  delay?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

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
    if (!kinetic || reduced || !finePointer) return;
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
        el.style.fontVariationSettings = `"wdth" 62, "wght" ${Math.round(900 - near * 680)}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = py = -9999;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [kinetic, reduced, finePointer, text]);

  return (
    <span
      ref={wrapRef}
      className={`rise w-full ${show ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      <span ref={innerRef} className={`display !inline-block whitespace-nowrap ${outline ? "outline-text" : ""}`}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {text.split("").map((ch, i) => (
            <span key={i} data-l className="inline-block transition-[font-variation-settings] duration-300 ease-out">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
