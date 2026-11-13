import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/*
 * One thin pen line that runs the length of the page behind everything and
 * draws itself as you scroll, with a small dot at the tip. It wanders from
 * side to side with the odd loop, like a signature that kept going.
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothPath(P: [number, number][]) {
  let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(i - 1, 0)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(i + 2, P.length - 1)];
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(
      p2[1] -
      (p3[1] - p1[1]) / 6
    ).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export default function ScrollLine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current!;
    const path = pathRef.current!;
    const dot = dotRef.current!;
    const host = svg.parentElement!;
    let total = 0;
    let shown = 0;
    let top = 0;
    let H = 0;
    let W = 0;
    let raf = 0;

    const build = () => {
      const w = host.clientWidth;
      const h = host.offsetHeight;
      if (w === W && Math.abs(h - H) < 4) return;
      W = w;
      H = h;
      const vh = window.innerHeight;
      top = vh * 1.0; // starts just under the hero
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const rand = mulberry32(11);
      const step = Math.max(300, vh * 0.55);
      const r = Math.min(W * 0.11, 80);
      const pts: [number, number][] = [[W * 0.5, top]];
      let side = 1;
      for (let y = top + step * 0.5, i = 0; y < H - 120; y += step, i++) {
        const x = W * (0.5 + side * (0.2 + rand() * 0.2));
        pts.push([x, y]);
        if (i % 3 === 1) {
          // a loop
          pts.push([x + side * r, y + r], [x, y + 2 * r], [x - side * r, y + r], [x + side * r * 0.35, y + r * 0.15]);
        }
        side *= -1;
      }
      pts.push([W * 0.5, H - 60]);
      path.setAttribute("d", smoothPath(pts));
      total = path.getTotalLength();
      path.style.strokeDasharray = `${total}`;
      update(true);
    };

    const target = () => {
      const frac = (window.scrollY + window.innerHeight * 0.72 - top) / Math.max(1, H - top - 60);
      return total * Math.min(1, Math.max(0, frac));
    };

    const paint = () => {
      path.style.strokeDashoffset = `${total - shown}`;
      const pt = path.getPointAtLength(shown);
      dot.setAttribute("cx", `${pt.x}`);
      dot.setAttribute("cy", `${pt.y}`);
      dot.style.opacity = shown > 2 && shown < total - 2 && !reduced ? "1" : "0";
    };

    function update(jump = false) {
      raf = 0;
      const goal = reduced ? total : target();
      shown = jump || reduced ? goal : shown + (goal - shown) * 0.12;
      paint();
      if (Math.abs(goal - shown) > 0.5) raf = requestAnimationFrame(() => update());
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(() => update());
    };

    const ro = new ResizeObserver(build);
    ro.observe(host);
    window.addEventListener("scroll", kick, { passive: true });
    build();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
    };
  }, [reduced]);

  return (
    <svg ref={svgRef} aria-hidden="true" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-accent">
      <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.32" />
      <circle ref={dotRef} r="4.5" fill="currentColor" style={{ opacity: 0, transition: "opacity 300ms" }} />
    </svg>
  );
}
