import { useEffect, useRef, type CSSProperties } from "react";
import { SectionHead } from "@/components/Reveal";
import { PROFILE } from "@/data/links";
import { useReducedMotion } from "@/lib/hooks";

const WORDS = `${PROFILE.intro} ${PROFILE.about[0]}`.split(" ");

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  // Words light up as the paragraph crosses the screen.
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
    <section id="about" aria-labelledby="about-title" className="py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="about-title" title="About" />
          <p
            ref={textRef}
            className="max-w-[62rem] text-[clamp(1.9rem,4.6vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.02em]"
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
      </div>
    </section>
  );
}
