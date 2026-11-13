import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";

/*
 * An endless row. It drifts on its own, speeds up and leans with the scroll,
 * and reverses when the page scrolls the other way.
 */
export default function Marquee({ children, reverse = false, speed = 0.05, className = "" }: { children: ReactNode; reverse?: boolean; speed?: number; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = trackRef.current!;
    if (reduced) return;
    const dir = reverse ? 1 : -1;
    let raf = 0;
    let x = 0;
    let vel = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let visible = false;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(50, now - last);
      last = now;
      const y = window.scrollY;
      vel += (y - lastY - vel) * 0.18;
      lastY = y;
      const half = el.scrollWidth / 2;
      x += dir * (speed * dt + vel * 0.9);
      x = ((x % half) - half) % half;
      const skew = Math.max(-9, Math.min(9, vel * 0.22)) * dir;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el.parentElement!);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reverse, speed, reduced]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
