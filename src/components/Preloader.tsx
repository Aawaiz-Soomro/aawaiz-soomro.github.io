import { useEffect, useRef, useState } from "react";
import logoFile from "@/assets/Aawaiz.S-Logo.png?w=400&format=webp&quality=80";

const DURATION = 2300;
const EXIT = 900;

/*
 * Opening sequence: grain drifts in and assembles into the signature while a
 * counter runs to 100, then the panel lifts off the page.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let cancelled = false;
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      setLeaving(true);
      doneTimer = window.setTimeout(() => {
        document.documentElement.style.overflow = "";
        onDone();
      }, EXIT);
    };

    const img = new Image();
    img.src = logoFile;
    img.onerror = finish;
    img.onload = () => {
      if (cancelled) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample the signature into target points.
      const logoW = Math.min(W * 0.72, 560);
      const logoH = (logoW * img.height) / img.width;
      const sw = 300;
      const sh = Math.round((sw * img.height) / img.width);
      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, sw, sh);
      const data = octx.getImageData(0, 0, sw, sh).data;
      const ox = (W - logoW) / 2;
      const oy = (H - logoH) / 2 - H * 0.03;
      const pts: { tx: number; ty: number; sx: number; sy: number; delay: number; mint: boolean }[] = [];
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          if (data[(y * sw + x) * 4 + 3] < 110) continue;
          const angle = Math.random() * Math.PI * 2;
          const dist = (0.25 + Math.random() * 0.6) * Math.max(W, H);
          const tx = ox + (x / sw) * logoW;
          const ty = oy + (y / sh) * logoH;
          pts.push({
            tx,
            ty,
            sx: tx + Math.cos(angle) * dist,
            sy: ty + Math.sin(angle) * dist * 0.7,
            delay: (x / sw) * 0.35 + Math.random() * 0.25,
            mint: Math.random() < 0.06,
          });
        }
      }

      const size = Math.max(1.1, (logoW / sw) * 0.95);
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        ctx.clearRect(0, 0, W, H);
        for (const p of pts) {
          const local = Math.min(1, Math.max(0, (t - p.delay * 0.55) / 0.42));
          const e = 1 - Math.pow(1 - local, 4);
          const swirl = (1 - e) * 26;
          const x = p.sx + (p.tx - p.sx) * e + Math.sin(now * 0.004 + p.ty * 0.05) * swirl;
          const y = p.sy + (p.ty - p.sy) * e + Math.cos(now * 0.004 + p.tx * 0.05) * swirl;
          ctx.globalAlpha = 0.25 + e * 0.75;
          ctx.fillStyle = p.mint ? "#95e6cb" : "#ece8dd";
          ctx.fillRect(x, y, size, size);
        }
        if (countRef.current) {
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
        }
        if (t < 1) raf = requestAnimationFrame(frame);
        else exitTimer = window.setTimeout(finish, 320);
      };
      raf = requestAnimationFrame(frame);
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[80] bg-bg transition-transform ease-in-out"
      style={{ transitionDuration: `${EXIT}ms`, transform: leaving ? "translateY(-100%)" : "none" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="wrap absolute inset-x-0 bottom-6 flex items-end justify-between sm:bottom-8">
        <span ref={countRef} className="display text-[clamp(4.5rem,13vw,10rem)] text-ink">
          000
        </span>
      </div>
    </div>
  );
}
