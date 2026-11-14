import type { CSSProperties, ReactNode } from "react";
import { useInView, useScrollVar } from "@/lib/hooks";

/** A line of text that slides up out of a clip the first time it is seen. */
export function Rise({ children, delay = 0, className = "", show }: { children: ReactNode; delay?: number; className?: string; show?: boolean }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const on = show ?? seen;
  return (
    <span ref={ref} className={`rise ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

export function Fade({ children, delay = 0, className = "", show }: { children: ReactNode; delay?: number; className?: string; show?: boolean }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const on = show ?? seen;
  return (
    <div ref={ref} className={`fade ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Section title: letters swing up, and the word drifts sideways as you scroll. */
export function SectionHead({ title, id }: { title: string; id: string }) {
  const [inView, seen] = useInView<HTMLSpanElement>();
  const scrollRef = useScrollVar<HTMLHeadingElement>();
  return (
    <h2 id={id} ref={scrollRef} className="mb-8 overflow-hidden border-b border-[color-mix(in_srgb,currentColor_35%,transparent)] pb-3 sm:mb-12" style={{ "--p": 0.5 } as CSSProperties}>
      <span
        ref={inView}
        className={`display -my-[0.08em] block whitespace-nowrap py-[0.08em] text-[clamp(3.75rem,15vw,11rem)] will-change-transform ${seen ? "letters-in" : ""}`}
        style={{ transform: "translateX(calc(max(0, 0.7 - var(--p)) * 26vw))" }}
      >
        <span className="sr-only">{title}</span>
        <span aria-hidden="true">
          {title.split("").map((ch, i) => (
            <span key={i} className="ltr" style={{ "--i": i } as CSSProperties}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </span>
    </h2>
  );
}
