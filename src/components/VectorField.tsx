import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "@/data/projects";
import { STACK, type Cluster } from "@/data/skills";
import { useReducedMotion } from "@/lib/hooks";

/*
 * The hero's "embedding field": every project and skill is a point, placed so
 * that related things sit together. The cursor is a nearest-neighbour query:
 * the k closest points connect to it and show a similarity score. With no
 * cursor the query drifts on its own. Clicking a project point opens it.
 */

const K_WIDE = 5;
const K_NARROW = 3;

// Cluster centres in a unit square.
const CENTERS: Record<Cluster, [number, number]> = {
  ai: [0.34, 0.24],
  backend: [0.7, 0.36],
  web: [0.8, 0.76],
  systems: [0.24, 0.7],
  tools: [0.52, 0.92],
};

const CLUSTER_LABEL: Record<Cluster, string> = {
  ai: "ai/",
  backend: "backend/",
  web: "web/",
  systems: "systems/",
  tools: "tools/",
};

type Kind = "project" | "skill" | "noise";
type Node = {
  x: number;
  y: number;
  kind: Kind;
  label?: string;
  slug?: string;
  phase: number;
  delay: number;
  // Screen position, recomputed every frame.
  sx: number;
  sy: number;
  appear: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNodes(): Node[] {
  const rand = mulberry32(7);
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const clamp = (v: number) => Math.min(0.98, Math.max(0.02, v));
  const nodes: Node[] = [];
  const push = (x: number, y: number, kind: Kind, extra: Partial<Node> = {}) =>
    nodes.push({
      x: clamp(x),
      y: clamp(y),
      kind,
      phase: rand() * Math.PI * 2,
      delay: 0,
      sx: 0,
      sy: 0,
      appear: 0,
      ...extra,
    });

  for (const [cx, cy] of Object.values(CENTERS)) {
    for (let i = 0; i < 52; i++) push(cx + gauss() * 0.085, cy + gauss() * 0.085, "noise");
  }
  for (let i = 0; i < 46; i++) push(rand(), rand(), "noise");

  for (const row of STACK) {
    const [cx, cy] = CENTERS[row.id];
    for (const item of row.items) push(cx + gauss() * 0.075, cy + gauss() * 0.075, "skill", { label: item });
  }

  for (const p of PROJECTS) {
    let x = 0;
    let y = 0;
    let total = 0;
    for (const [c, w] of Object.entries(p.clusters) as [Cluster, number][]) {
      x += CENTERS[c][0] * w;
      y += CENTERS[c][1] * w;
      total += w;
    }
    push(x / total + gauss() * 0.035, y / total + gauss() * 0.035, "project", {
      label: p.title,
      slug: p.slug,
    });
  }

  // Intro: points further from the middle arrive later.
  for (const n of nodes) n.delay = Math.hypot(n.x - 0.5, n.y - 0.5) * 650 + rand() * 250;
  return nodes;
}

type Palette = Record<"ink" | "muted" | "faint" | "accent" | "accentInk" | "signal" | "bg", string>;

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => css.getPropertyValue(name).trim();
  return {
    ink: get("--ink"),
    muted: get("--muted"),
    faint: get("--faint"),
    accent: get("--accent"),
    accentInk: get("--accent-ink"),
    signal: get("--signal"),
    bg: get("--bg"),
  };
}

function rgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export default function VectorField({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = buildNodes();
    const projects = nodes.filter((n) => n.kind === "project");
    const labelled = nodes.filter((n) => n.kind !== "noise");
    const featured = projects.find((n) => n.slug === PROJECTS.find((p) => p.featured)?.slug) ?? projects[0];

    let palette = readPalette();
    let w = 0;
    let h = 0;
    let region = { x: 0, y: 0, w: 0, h: 0 };
    let wide = true;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    let last = start;

    // Query point in screen space, its target, and pointer state.
    const query = { x: 0, y: 0, tx: 0, ty: 0, init: false };
    let pointer: { x: number; y: number } | null = null;
    let hover: Node | null = null;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wide = w >= 900;
      // Desktop: the field fills the right side, text sits on the left.
      // Narrow screens: the field fills the top, text sits below it.
      const vh = Math.min(h, window.innerHeight);
      region = wide
        ? { x: w * 0.44, y: h * 0.13, w: w * 0.52, h: h * 0.74 }
        : { x: w * 0.05, y: 84, w: w * 0.9, h: vh * 0.29 };
    };

    const toScreen = (n: Node, t: number) => {
      const drift = reduced ? 0 : 0.006;
      const dx = Math.sin(t * 0.00035 + n.phase) * drift;
      const dy = Math.cos(t * 0.00029 + n.phase * 1.3) * drift;
      const tx = region.x + (n.x + dx) * region.w;
      const ty = region.y + (n.y + dy) * region.h;
      if (reduced) {
        n.appear = 1;
        n.sx = tx;
        n.sy = ty;
        return;
      }
      const p = easeOut(Math.min(1, Math.max(0, (t - start - n.delay) / 1100)));
      const ox = region.x + region.w * 0.5;
      const oy = region.y + region.h * 0.5;
      n.appear = p;
      n.sx = ox + (tx - ox) * p;
      n.sy = oy + (ty - oy) * p;
    };

    const autoTarget = (t: number) => {
      if (reduced) return { x: featured.sx + 30, y: featured.sy - 24 };
      const s = t * 0.001;
      return {
        x: region.x + region.w * (0.5 + 0.34 * Math.sin(s * 0.23)),
        y: region.y + region.h * (0.5 + 0.32 * Math.sin(s * 0.37 + 1.2)),
      };
    };

    const draw = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) toScreen(n, t);

      const target = pointer ?? autoTarget(t);
      query.tx = target.x;
      query.ty = target.y;
      if (!query.init || reduced) {
        query.x = query.tx;
        query.y = query.ty;
        query.init = true;
      } else {
        const k = 1 - Math.exp(-dt / (pointer ? 70 : 260));
        query.x += (query.tx - query.x) * k;
        query.y += (query.ty - query.y) * k;
      }

      const introDone = reduced || t - start > 1900;
      const queryAlpha = reduced ? 1 : Math.min(1, Math.max(0, (t - start - 900) / 700));

      // Nearest neighbours of the query among projects and skills.
      const scale = Math.min(region.w, region.h) * 0.45;
      const ranked = labelled
        .map((n) => ({ n, d: Math.hypot(n.sx - query.x, n.sy - query.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, wide ? K_WIDE : K_NARROW);
      const nearest = new Map(ranked.map((r) => [r.n, Math.exp(-((r.d / scale) ** 2))]));
      const radius = ranked[ranked.length - 1]?.d ?? 0;

      // Cluster names.
      ctx.font = "500 12px 'Fira Code', monospace";
      ctx.textAlign = "center";
      for (const [c, [cx, cy]] of wide ? (Object.entries(CENTERS) as [Cluster, [number, number]][]) : []) {
        const a = reduced ? 1 : Math.min(1, Math.max(0, (t - start - 600) / 800));
        ctx.fillStyle = rgba(palette.faint, 0.7 * a);
        ctx.fillText(CLUSTER_LABEL[c], region.x + cx * region.w, region.y + (cy - 0.13) * region.h);
      }

      // Background points, brighter near the query.
      const glow = Math.max(110, radius * 1.4);
      for (const n of nodes) {
        if (n.kind !== "noise") continue;
        const d = Math.hypot(n.sx - query.x, n.sy - query.y);
        const near = Math.max(0, 1 - d / glow) * queryAlpha;
        ctx.fillStyle = near > 0.02 ? rgba(palette.signal, 0.18 + near * 0.6) : rgba(palette.ink, 0.17);
        ctx.globalAlpha = n.appear;
        ctx.fillRect(n.sx - 0.9, n.sy - 0.9, 1.8, 1.8);
      }
      ctx.globalAlpha = 1;

      // Neighbourhood circle and connecting lines.
      if (queryAlpha > 0) {
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = rgba(palette.signal, 0.35 * queryAlpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(query.x, query.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        for (const [n, s] of nearest) {
          ctx.strokeStyle = rgba(palette.signal, (0.25 + s * 0.6) * queryAlpha);
          ctx.beginPath();
          ctx.moveTo(query.x, query.y);
          ctx.lineTo(n.sx, n.sy);
          ctx.stroke();
        }
      }

      // Skills.
      for (const n of nodes) {
        if (n.kind !== "skill") continue;
        const on = nearest.has(n);
        ctx.globalAlpha = n.appear;
        ctx.fillStyle = rgba(palette.signal, on ? 1 : 0.5);
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, on ? 3 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Projects.
      for (const n of projects) {
        const on = nearest.has(n) || hover === n;
        ctx.globalAlpha = n.appear;
        ctx.fillStyle = palette.accent;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = rgba(palette.accentInk, on ? 0.9 : 0.4);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, hover === n ? 12 : 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Labels: projects always, skills only when they are a neighbour.
      // Placed greedily (neighbours first) so they don't overlap or leave the canvas.
      const labelFont = wide ? 13 : 11;
      const placed: { x: number; y: number; w: number; h: number }[] = [];
      const overlaps = (r: { x: number; y: number; w: number; h: number }) =>
        r.x < 2 || r.x + r.w > w - 2 || placed.some((p) => r.x < p.x + p.w && r.x + r.w > p.x && r.y < p.y + p.h && r.y + r.h > p.y);
      const order = [...labelled]
        .filter((n) => n.kind === "project" || nearest.has(n))
        .sort((a, b) => Number(nearest.has(b) || hover === b) - Number(nearest.has(a) || hover === a));

      for (const n of order) {
        const s = nearest.get(n);
        const showScore = s !== undefined && queryAlpha > 0.5;
        const label = n.label ?? "";
        const score = showScore ? s!.toFixed(2) : "";
        ctx.font = `${n.kind === "project" ? 500 : 400} ${labelFont}px 'Fira Code', monospace`;
        const lw = ctx.measureText(label).width;
        const sw = score ? ctx.measureText(score).width + 8 : 0;
        const bw = lw + sw;
        const bh = labelFont + 4;
        const gap = n.kind === "project" ? 14 : 8;
        const candidates = [
          { x: n.sx + gap, y: n.sy - bh / 2 },
          { x: n.sx - gap - bw, y: n.sy - bh / 2 },
          { x: n.sx - bw / 2, y: n.sy - gap - bh },
          { x: n.sx - bw / 2, y: n.sy + gap },
        ];
        let spot = candidates.find((c) => !overlaps({ ...c, w: bw, h: bh }));
        if (!spot) {
          // On small screens drop labels that don't fit, except the query's neighbours.
          if (!showScore && (!wide || n.kind === "skill")) continue;
          spot = { x: Math.min(Math.max(2, candidates[0].x), w - bw - 2), y: candidates[0].y };
        }
        placed.push({ ...spot, w: bw, h: bh });
        const baseline = spot.y + bh - 4;
        ctx.textAlign = "left";
        ctx.fillStyle = rgba(showScore || hover === n ? palette.ink : palette.muted, n.appear * (n.kind === "project" ? 0.95 : 0.9));
        ctx.fillText(label, spot.x, baseline);
        if (score) {
          ctx.font = `400 ${labelFont - 1}px 'Fira Code', monospace`;
          ctx.fillStyle = rgba(palette.signal, queryAlpha);
          ctx.fillText(score, spot.x + lw + 8, baseline);
        }
      }

      // Query marker.
      if (queryAlpha > 0) {
        ctx.strokeStyle = rgba(palette.signal, queryAlpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(query.x, query.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          ctx.moveTo(query.x + ax * 9, query.y + ay * 9);
          ctx.lineTo(query.x + ax * 15, query.y + ay * 15);
        }
        ctx.stroke();
        ctx.font = "400 11px 'Fira Code', monospace";
        ctx.fillStyle = rgba(palette.signal, queryAlpha * 0.9);
        ctx.fillText(`k=${wide ? K_WIDE : K_NARROW}`, query.x + 12, query.y - 12);
      }

      return introDone;
    };

    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      draw(t);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const requestDraw = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const hitTest = (x: number, y: number) => {
      let best: Node | null = null;
      let bestD = 22;
      for (const n of projects) {
        const d = Math.hypot(n.sx - x, n.sy - y);
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }
      return best;
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer = p;
      hover = hitTest(p.x, p.y);
      const overUi = (e.target as Element).closest("a,button");
      host.style.cursor = hover && !overUi ? "pointer" : "";
      requestDraw();
    };
    const onLeave = () => {
      pointer = null;
      hover = null;
      host.style.cursor = "";
      requestDraw();
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a,button")) return;
      const r = canvas.getBoundingClientRect();
      const n = hitTest(e.clientX - r.left, e.clientY - r.top);
      if (n?.slug) navigate(`/projects/${n.slug}`);
    };

    const resizeObserver = new ResizeObserver(() => {
      layout();
      requestDraw();
    });
    resizeObserver.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) {
        last = performance.now();
        requestDraw();
      }
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        last = performance.now();
        requestDraw();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Re-read colours when the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      requestDraw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("click", onClick);

    layout();
    document.fonts?.ready.then(requestDraw);
    requestDraw();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      host.style.cursor = "";
    };
  }, [hostRef, reduced, navigate]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full touch-pan-y" />;
}
