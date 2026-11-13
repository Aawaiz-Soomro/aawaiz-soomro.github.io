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

/** Numbered section heading shared by every section. */
export function SectionHead({ index, title, note, id }: { index: string; title: string; note?: ReactNode; id: string }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line-strong pb-5 sm:mb-14">
      <h2 id={id} className="flex items-start gap-3 sm:gap-5">
        <span className="tag mt-1 text-accent sm:mt-2">{index}</span>
        <Rise className="display text-[clamp(3.5rem,11vw,9.5rem)]">{title}</Rise>
      </h2>
      {note && <div className="max-w-sm pb-1 text-muted sm:text-right">{note}</div>}
    </header>
  );
}
