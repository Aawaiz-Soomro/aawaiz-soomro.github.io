import { useEffect, useRef, type RefObject } from "react";
import { withBase } from "@/data/links";
import { useReducedMotion } from "@/lib/hooks";

/*
 * The hero portrait: a halftone of my face (baked into public/portrait.bin:
 * position, brightness and a depth value per dot). Every dot is the same
 * colour; only its size carries light and dark, and the dark areas are left
 * as bare background, so the face has no outline and sits in the page.
 *
 * The dots fly in and assemble. Brighter areas sit "closer", so shifting dots
 * by depth makes the face turn slightly: it follows the pointer, or sways on
 * its own on touch screens. Dots flee from a moving pointer or finger, a tap
 * sends a shockwave through them, and they scatter as the page scrolls away.
 */
const COLS = 78; // grid width used when baking
const INK = "236,232,221";
const DUST = 160; // loose dots drifting around the portrait

export default function PortraitField({ active, floorRef }: { active: boolean; floorRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const reduced = useReducedMotion();
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let cancelled = false;
    let cleanup = () => {};

    fetch(withBase("portrait.bin")!)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (cancelled) return;
        const head = new Uint16Array(buf, 0, 2);
        const m = head[0]; // portrait dots
        const n = m + DUST;
        const aspect = head[1] / 1000;
        const nx = new Uint16Array(buf, 4, m);
        const ny = new Uint16Array(buf, 4 + m * 2, m);
        const lumRaw = new Uint8Array(buf, 4 + m * 4, m);
        const depRaw = new Uint8Array(buf, 4 + m * 5, m);

        const hx = new Float32Array(n);
        const hy = new Float32Array(n);
        const px = new Float32Array(n);
        const py = new Float32Array(n);
        const vx = new Float32Array(n);
        const vy = new Float32Array(n);
        const lum = new Float32Array(n);
        const dep = new Float32Array(n);
        const delay = new Float32Array(n);
        const dirX = new Float32Array(n);
        const dirY = new Float32Array(n);
        const ux = new Float32Array(n);
        const uy = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          if (i < m) {
            lum[i] = lumRaw[i] / 255;
            dep[i] = depRaw[i] / 255 - 0.5;
          } else {
            lum[i] = 0.1 + Math.random() * 0.22;
            ux[i] = Math.random();
            uy[i] = Math.random();
          }
          const a = Math.random() * Math.PI * 2;
          dirX[i] = Math.cos(a);
          dirY[i] = Math.sin(a);
        }

        let W = 0;
        let H = 0;
        let cell = 3;
        let boxW = 0;
        let placed = false;
        let started = 0;
        let raf = 0;
        let visible = true;
        // Full sharpness by default; stepped down once if the device cannot keep up.
        let dprCap = 3;
        let slow = 0;
        let frames = 0;
        let prev = 0;
        const pointer = { x: -9999, y: -9999, live: false, fine: false, t: 0 };
        const tilt = { x: 0, y: 0 };

        const layout = () => {
          const rect = host.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
          W = rect.width;
          H = rect.height;
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          // The portrait fills the space above the name and sinks a little behind it.
          const top = 72;
          const floor = floorRef.current ? floorRef.current.getBoundingClientRect().top - rect.top : H * 0.6;
          const boxH = Math.max(160, (floor - top) / 0.86);
          boxW = Math.min(boxH / aspect, W * 0.96);
          const bx = (W - boxW) / 2;
          cell = boxW / COLS;
          for (let i = 0; i < n; i++) {
            if (i < m) {
              hx[i] = bx + (nx[i] / 65535) * boxW;
              hy[i] = top + (ny[i] / 65535) * boxW * aspect;
            } else {
              hx[i] = ux[i] * W;
              hy[i] = uy[i] * H;
            }
            if (!placed) {
              // Start scattered; dots nearer the middle arrive first.
              const far = 0.4 + Math.random() * 0.9;
              px[i] = hx[i] + dirX[i] * far * Math.max(W, H) * 0.7;
              py[i] = hy[i] + dirY[i] * far * Math.max(W, H) * 0.7;
              delay[i] = i < m ? Math.hypot(nx[i] / 65535 - 0.5, ny[i] / 65535 - 0.45) * 1100 + Math.random() * 350 : 600 + Math.random() * 1200;
            }
          }
          placed = true;
        };

        const draw = (now: number) => {
          raf = 0;
          if (!activeRef.current) {
            raf = requestAnimationFrame(draw);
            return;
          }
          if (!started) started = now;
          const t = now - started;
          if (dprCap > 2 && t > 3200 && prev) {
            frames++;
            if (now - prev > 26) slow++;
            if (frames === 90) {
              if (slow > 45) {
                dprCap = 2;
                layout();
              } else frames = slow = 0;
            }
          }
          prev = now;
          const scroll = Math.min(1, Math.max(0, window.scrollY / Math.max(1, H)));
          const scatter = Math.pow(scroll, 1.4) * Math.max(W, 500) * 0.9;

          // Turn the face: toward the pointer, or a slow sway of its own.
          let tx = Math.sin(now * 0.0006) * 0.9;
          let ty = Math.cos(now * 0.00045) * 0.5;
          if (pointer.fine && now - pointer.t < 4000) {
            tx = (pointer.x / W - 0.5) * 2.4;
            ty = (pointer.y / H - 0.4) * 1.6;
          }
          tilt.x += (tx - tilt.x) * 0.06;
          tilt.y += (ty - tilt.y) * 0.06;
          const amp = boxW * 0.03;
          const reach = Math.max(70, boxW * 0.2);
          const reach2 = reach * reach;
          const fleeing = pointer.live && now - pointer.t < 900;

          ctx.clearRect(0, 0, W, H);
          const moved: number[] = [];
          ctx.fillStyle = `rgba(${INK},${(1 - Math.min(1, scroll * 1.5)).toFixed(3)})`;
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            if (!reduced) {
              let goalX = hx[i] + dep[i] * tilt.x * amp + dirX[i] * scatter;
              let goalY = hy[i] + dep[i] * tilt.y * amp + dirY[i] * scatter - scatter * 0.35;
              if (i >= m) {
                // dust wanders
                goalX += Math.sin(now * 0.0003 + i) * 18;
                goalY += Math.cos(now * 0.00024 + i * 1.7) * 18;
              }
              if (t > delay[i]) {
                vx[i] = (vx[i] + (goalX - px[i]) * 0.07) * 0.84;
                vy[i] = (vy[i] + (goalY - py[i]) * 0.07) * 0.84;
              }
              if (fleeing) {
                const dx = px[i] - pointer.x;
                const dy = py[i] - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < reach2 && d2 > 0.01) {
                  const d = Math.sqrt(d2);
                  const f = (1 - d / reach) ** 2 * 3.2;
                  vx[i] += (dx / d) * f;
                  vy[i] += (dy / d) * f;
                }
              }
              px[i] += vx[i];
              py[i] += vy[i];
            } else {
              px[i] = hx[i];
              py[i] = hy[i];
            }
            if (t < delay[i] && !reduced) continue;

            // Dots knocked out of place are drawn in mint afterwards.
            const off = Math.abs(px[i] - hx[i]) + Math.abs(py[i] - hy[i]);
            if (i < m && off > amp + 6 && scroll < 0.02 && t > 2600) {
              moved.push(i);
              continue;
            }
            const r = Math.max(0.45, (0.08 + 0.92 * Math.pow(lum[i], 1.15)) * cell * 0.5);
            ctx.moveTo(px[i] + r, py[i]);
            ctx.arc(px[i], py[i], r, 0, 6.283);
          }
          ctx.fill();
          if (moved.length) {
            ctx.fillStyle = "#95e6cb";
            ctx.beginPath();
            for (const i of moved) {
              const r = Math.max(0.8, (0.08 + 0.92 * Math.pow(lum[i], 1.15)) * cell * 0.5);
              ctx.moveTo(px[i] + r, py[i]);
              ctx.arc(px[i], py[i], r, 0, 6.283);
            }
            ctx.fill();
          }
          if (visible && !reduced) raf = requestAnimationFrame(draw);
        };
        const kick = () => {
          if (!raf) raf = requestAnimationFrame(draw);
        };

        const local = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          pointer.x = e.clientX - r.left;
          pointer.y = e.clientY - r.top;
          pointer.t = performance.now();
          pointer.fine = e.pointerType === "mouse";
        };
        const onMove = (e: PointerEvent) => {
          local(e);
          pointer.live = true;
        };
        // A tap or click sends a shockwave out from that point.
        const onDown = (e: PointerEvent) => {
          if ((e.target as Element).closest("a,button")) return;
          local(e);
          pointer.live = true;
          const r = Math.max(180, boxW * 0.6);
          for (let i = 0; i < n; i++) {
            const dx = px[i] - pointer.x;
            const dy = py[i] - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d > r || d < 0.01) continue;
            const f = (1 - d / r) ** 1.5 * 26;
            vx[i] += (dx / d) * f;
            vy[i] += (dy / d) * f;
          }
        };
        const onLeave = () => {
          pointer.live = false;
        };

        const ro = new ResizeObserver(() => {
          layout();
          kick();
        });
        ro.observe(host);
        if (floorRef.current) ro.observe(floorRef.current);
        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) kick();
        });
        io.observe(host);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerdown", onDown);
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("pointercancel", onLeave);
        layout();
        kick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerdown", onDown);
          host.removeEventListener("pointerleave", onLeave);
          host.removeEventListener("pointercancel", onLeave);
        };
      })
      .catch(() => {
        /* no portrait: the hero still works as type on a dark ground */
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [floorRef, reduced]);

  return <canvas ref={canvasRef} role="img" aria-label="Portrait of Aawaiz Soomro, drawn in dots" className="absolute inset-0 h-full w-full" />;
}
