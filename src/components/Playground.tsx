import { useEffect, useRef, useState, type RefObject } from "react";
import type Matter from "matter-js";
import { BLUE, CORAL, CREAM, GREEN, LILAC, MINT, ORANGE, YELLOW } from "@/data/palette";
import { useReducedMotion } from "@/lib/hooks";
import avatar from "@/assets/new-avatar.jpg?w=160&format=webp&quality=80";

/*
 * The hero's toys: word-pills about me (and my photo as a ball) drop in under
 * gravity and pile up on top of the name. They can be dragged and thrown, and
 * a tap on empty space pops the ones nearby.
 */
const WORDS = [
  { text: "Backend", color: MINT },
  { text: "AI", color: LILAC },
  { text: "Cloud", color: BLUE },
  { text: "CS @ FAST", color: YELLOW },
  { text: "Karachi", color: CREAM },
  { text: "Football", color: ORANGE },
  { text: "Gaming", color: GREEN },
  { text: "Music", color: CORAL },
  { text: "Gym, sometimes", color: LILAC },
  { text: "Dev", color: MINT },
];

const SUMMARY = "Backend, AI and cloud. CS at FAST, Karachi. Into football, gaming, music, and sometimes the gym.";

export default function Playground({ active, floorRef }: { active: boolean; floorRef: RefObject<HTMLElement | null> }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!active || reduced) return;
    const host = hostRef.current!;
    let cancelled = false;
    let dispose = () => {};

    const start = (M: typeof Matter) => {
      const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = M;
      const els = Array.from(host.querySelectorAll<HTMLElement>("[data-toy]"));
      const sizes = els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.15;

      const W = host.clientWidth;
      // The floor is the top of the name, a touch inside its letters.
      const measureFloor = () => {
        const top = floorRef.current ? floorRef.current.getBoundingClientRect().top - host.getBoundingClientRect().top : host.clientHeight;
        return Math.max(host.clientHeight * 0.3, top) + sizes[0].h * 0.12;
      };
      let floorY = measureFloor();
      const wall = { isStatic: true, friction: 0.6 };
      const floor = Bodies.rectangle(W / 2, floorY + 100, W * 3, 200, wall);
      const statics = [floor, Bodies.rectangle(-100, 0, 200, 12000, wall), Bodies.rectangle(W + 100, 0, 200, 12000, wall)];

      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      const bodies = els.map((el, i) => {
        const { w, h } = sizes[i];
        const x = w / 2 + 8 + rand() * Math.max(1, W - w - 16);
        const y = -h - i * 150; // later ones start higher, so they arrive one after another
        const body =
          el.dataset.toy === "ball"
            ? Bodies.circle(x, y, w / 2, { restitution: 0.55, friction: 0.3, frictionAir: 0.012 })
            : Bodies.rectangle(x, y, w, h, { chamfer: { radius: h / 2 - 1 }, restitution: 0.32, friction: 0.5, frictionAir: 0.012 });
        Body.setAngle(body, (rand() - 0.5) * 0.9);
        return body;
      });
      Composite.add(engine.world, [...statics, ...bodies]);

      let raf = 0;
      let visible = true;
      let last = performance.now();
      const tick = (now: number) => {
        raf = 0;
        // The frame timestamp can be slightly behind the clock on the first frame; never step backwards.
        const dt = Math.min(48, Math.max(1, now - last));
        last = Math.max(last, now);
        const steps = Math.max(1, Math.ceil(dt / (1000 / 60)));
        for (let s = 0; s < steps; s++) Engine.update(engine, dt / steps);
        bodies.forEach((b, i) => {
          els[i].style.transform = `translate3d(${b.position.x - sizes[i].w / 2}px, ${b.position.y - sizes[i].h / 2}px, 0) rotate(${b.angle}rad)`;
        });
        if (visible) raf = requestAnimationFrame(tick);
      };
      const kick = () => {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };

      // Drag and throw.
      let grab: { constraint: Matter.Constraint; id: number } | null = null;
      const point = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const onDown = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>("[data-toy]");
        if (!el || grab) return;
        const body = bodies[els.indexOf(el)];
        const p = point(e);
        Sleeping.set(body, false);
        const constraint = Constraint.create({
          pointA: p,
          bodyB: body,
          pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
          stiffness: 0.16,
          damping: 0.12,
          length: 0,
        });
        Composite.add(engine.world, constraint);
        grab = { constraint, id: e.pointerId };
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
        e.preventDefault();
      };
      const onMove = (e: PointerEvent) => {
        if (!grab || e.pointerId !== grab.id) return;
        grab.constraint.pointA = point(e);
        if (grab.constraint.bodyB) Sleeping.set(grab.constraint.bodyB, false);
      };
      const onUp = (e: PointerEvent) => {
        if (!grab || e.pointerId !== grab.id) return;
        Composite.remove(engine.world, grab.constraint);
        (e.target as HTMLElement).style.cursor = "";
        grab = null;
      };
      // A tap on empty space pops whatever is near it.
      const onClick = (e: MouseEvent) => {
        if ((e.target as Element).closest("[data-toy],a,button")) return;
        const r = host.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        const reach = Math.max(220, W * 0.35);
        for (const b of bodies) {
          const dx = b.position.x - px;
          const dy = b.position.y - py;
          const d = Math.hypot(dx, dy);
          if (d > reach) continue;
          const k = (1 - d / reach) * b.mass;
          Sleeping.set(b, false);
          Body.applyForce(b, b.position, { x: (dx / (d || 1)) * 0.03 * k, y: -0.05 * k });
          Body.setAngularVelocity(b, (rand() - 0.5) * 0.4);
        }
      };

      // The name can still be settling (fonts, fitting); keep the floor under it.
      const floorWatch = new ResizeObserver(() => {
        const y = measureFloor();
        if (Math.abs(y - floorY) < 1) return;
        floorY = y;
        Body.setPosition(floor, { x: W / 2, y: floorY + 100 });
        bodies.forEach((b) => Sleeping.set(b, false));
        kick();
      });
      if (floorRef.current) floorWatch.observe(floorRef.current);

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      });
      io.observe(host);
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerup", onUp);
      host.addEventListener("pointercancel", onUp);
      host.parentElement!.addEventListener("click", onClick);
      setLive(true);
      kick();

      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        floorWatch.disconnect();
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerup", onUp);
        host.removeEventListener("pointercancel", onUp);
        host.parentElement?.removeEventListener("click", onClick);
        Engine.clear(engine);
      };
    };

    let width = host.clientWidth;
    let M: typeof Matter | null = null;
    const boot = () => {
      dispose();
      if (M) dispose = start(M);
    };
    Promise.all([import("matter-js"), document.fonts?.ready]).then(([mod]) => {
      if (cancelled) return;
      M = (mod as { default?: typeof Matter }).default ?? (mod as unknown as typeof Matter);
      boot();
    });
    // A new width means new walls: start the drop again.
    const ro = new ResizeObserver(() => {
      if (host.clientWidth === width) return;
      width = host.clientWidth;
      boot();
    });
    ro.observe(host);

    return () => {
      cancelled = true;
      ro.disconnect();
      dispose();
    };
  }, [active, reduced, floorRef]);

  const pill = "display select-none whitespace-nowrap rounded-full px-4 py-2 text-[1.7rem] text-paper-ink sm:px-6 sm:py-3 sm:text-[2.75rem]";

  // With reduced motion the toys simply sit in a row.
  if (reduced) {
    return (
      <ul className="wrap flex flex-wrap gap-2 pb-4" aria-label={SUMMARY}>
        {WORDS.map((w) => (
          <li key={w.text} className={pill} style={{ backgroundColor: w.color }}>
            {w.text}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={hostRef} className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${live ? "opacity-100" : "opacity-0"}`}>
      <p className="sr-only">{SUMMARY}</p>
      {WORDS.map((w) => (
        <span
          key={w.text}
          data-toy="pill"
          aria-hidden="true"
          className={`${pill} pointer-events-auto absolute left-0 top-0 cursor-grab touch-none will-change-transform`}
          style={{ backgroundColor: w.color, transform: "translate3d(-999px,-999px,0)" }}
        >
          {w.text}
        </span>
      ))}
      <span
        data-toy="ball"
        aria-hidden="true"
        className="pointer-events-auto absolute left-0 top-0 size-20 cursor-grab touch-none overflow-hidden rounded-full border-[3px] border-ink will-change-transform sm:size-32"
        style={{ transform: "translate3d(-999px,-999px,0)" }}
      >
        <img src={avatar} alt="" draggable={false} className="h-full w-full object-cover" />
      </span>
    </div>
  );
}
