import { useEffect, useRef, type CSSProperties } from "react";
import { Fade, SectionHead } from "@/components/Reveal";
import { PROFILE } from "@/data/links";
import { useReducedMotion, useScrollVar } from "@/lib/hooks";
import avatar from "@/assets/new-avatar.jpg?w=600&format=webp";
import avatarSet from "@/assets/new-avatar.jpg?as=srcset&w=300;600;900&format=webp";

const WORDS = PROFILE.about[0].split(" ");

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useScrollVar<HTMLElement>();
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
    <section id="about" aria-labelledby="about-title" className="py-16 sm:py-24">
      <div className="wrap">
        <SectionHead id="about-title" title="About" />

        <div className="grid gap-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] md:items-start md:gap-14">
          {/* Portrait in the same block the project cards use. */}
          <Fade>
            <figure ref={photoRef} style={{ "--p": 0.5 } as CSSProperties} className="rounded-[2rem] bg-accent p-3 text-paper-ink sm:p-4">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={avatar}
                  srcSet={avatarSet}
                  sizes="(min-width: 768px) 30vw, 92vw"
                  alt="Portrait of Aawaiz Soomro"
                  width={600}
                  height={750}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover will-change-transform md:aspect-[4/5]"
                  style={{ transform: "scale(calc(1.22 - var(--p) * 0.22))" }}
                />
              </div>
              <figcaption className="flex items-center justify-between px-1 pt-3 font-mono text-xs uppercase tracking-[0.08em]">
                <span>{PROFILE.name}</span>
                <span>{PROFILE.location}</span>
              </figcaption>
            </figure>
          </Fade>

          <div>
            <p
              ref={textRef}
              className="text-[clamp(1.75rem,3.9vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em]"
              style={{ "--p": 0 } as CSSProperties}
            >
              <span className="sr-only">{WORDS.join(" ")}</span>
              <span aria-hidden="true">
                {WORDS.map((w, i) => (
                  <span key={i} style={{ opacity: `clamp(0.16, calc(var(--p) * ${WORDS.length + 4} - ${i}), 1)` }}>
                    {w}{" "}
                  </span>
                ))}
              </span>
            </p>
            <Fade className="mt-8 max-w-xl border-t border-line-strong pt-5 text-lg text-muted">
              <p>{PROFILE.about[1]}</p>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
