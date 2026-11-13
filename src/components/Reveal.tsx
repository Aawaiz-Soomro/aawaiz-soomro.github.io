import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/hooks";

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

/** Section title shared by every section. */
export function SectionHead({ title, id }: { title: string; id: string }) {
  return (
    <h2 id={id} className="mb-8 border-b border-line-strong pb-4 sm:mb-12">
      <Rise className="display text-[clamp(3.25rem,10vw,8.5rem)]">{title}</Rise>
    </h2>
  );
}
