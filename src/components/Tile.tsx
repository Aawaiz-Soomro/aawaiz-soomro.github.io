import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/hooks";

/*
 * The site's one building block: a rounded colour tile with dark ink on it.
 * It tips up into place the first time it is seen (or when `show` turns true).
 */
export default function Tile({
  color,
  children,
  className = "",
  delay = 0,
  show,
  lift = true,
}: {
  color: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  show?: boolean;
  /** Rise slightly on hover. */
  lift?: boolean;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const on = show ?? seen;
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ease-out ${on ? "" : "translate-y-10 rotate-2 scale-90 opacity-0"} ${className}`}
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[2rem] text-paper-ink transition-transform duration-500 ease-out ${lift ? "hover:-translate-y-1.5" : ""}`}
        style={{ backgroundColor: color } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** The round ink button that sits in a tile's corner. */
export function Corner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`grid size-11 shrink-0 place-items-center rounded-full bg-paper-ink text-white transition-transform duration-500 ease-out ${className}`}>
      {children}
    </span>
  );
}
