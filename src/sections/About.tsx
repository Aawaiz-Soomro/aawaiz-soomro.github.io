import { useEffect, useRef, type CSSProperties } from "react";
import { Fade, SectionHead } from "@/components/Reveal";
import { PROFILE } from "@/data/links";
import { useReducedMotion, useScrollVar } from "@/lib/hooks";
import avatar from "@/assets/new-avatar.jpg?w=600&format=webp";
import avatarSet from "@/assets/new-avatar.jpg?as=srcset&w=300;600;900&format=webp";

const WORDS = `${PROFILE.intro} ${PROFILE.about[0]}`.split(" ");

// "Outside of tech, I enjoy…" as stickers.
const OFF_HOURS = [
  { label: "Gaming", color: "#d4bfff", tilt: -6 },
  { label: "Football", color: "#95e6cb", tilt: 4 },
  { label: "Music", color: "#ffcc66", tilt: -3 },
  { label: "The gym, occasionally", color: "#73d0ff", tilt: 5 },
];

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useScrollVar<HTMLDivElement>();
  const reduced = useReducedMotion();

  // Words ink in as the paragraph crosses the screen.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.9 - r.top) / (r.height + vh * 0.3);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-paper py-16 text-paper-ink sm:py-24">
      <div className="wrap">
        <SectionHead id="about-title" title="About" />

        <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:gap-14">
          {/* Portrait: tilts straight and zooms as it passes. */}
          <div ref={photoRef} style={{ "--p": 0.5 } as CSSProperties} className="relative mx-auto w-[min(72vw,22rem)] md:mx-0 md:w-full">
            <div
              className="overflow-hidden rounded-[2rem] bg-paper-ink will-change-transform"
              style={{ transform: "rotate(calc((0.5 - var(--p)) * 14deg))" }}
            >
              <img
                src={avatar}
                srcSet={avatarSet}
                sizes="(min-width: 768px) 30vw, 72vw"
                alt="Portrait of Aawaiz Soomro"
                width={600}
                height={750}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover will-change-transform"
                style={{ transform: "scale(calc(1.25 - var(--p) * 0.25))" }}
              />
            </div>
            <span
              aria-hidden="true"
              className="display absolute -right-3 -top-4 grid size-20 place-items-center rounded-full bg-accent text-2xl will-change-transform sm:size-24 sm:text-3xl"
              style={{ transform: "rotate(calc(var(--p) * 200deg - 60deg))" }}
            >
              Hi!
            </span>
          </div>

          <div>
            <p
              ref={textRef}
              className="text-[clamp(1.75rem,3.9vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ "--p": 0 } as CSSProperties}
            >
              <span className="sr-only">{WORDS.join(" ")}</span>
              <span aria-hidden="true">
                {WORDS.map((w, i) => (
                  <span key={i} style={{ opacity: `clamp(0.14, calc(var(--p) * ${WORDS.length + 4} - ${i}), 1)` }}>
                    {w}{" "}
                  </span>
                ))}
              </span>
            </p>

            <p className="mt-10 font-mono text-xs uppercase tracking-[0.08em]">Outside of tech</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {OFF_HOURS.map((h, i) => (
                <li key={h.label}>
                  <Fade delay={i * 90}>
                    <span
                      className="display inline-block rounded-full px-5 py-2.5 text-2xl transition-transform duration-300 ease-out hover:!rotate-0 hover:scale-110 active:scale-95 sm:text-3xl"
                      style={{ backgroundColor: h.color, rotate: `${h.tilt}deg` }}
                    >
                      {h.label}
                    </span>
                  </Fade>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
