import { SIGNATURE } from "@/data/signature";

/*
 * The signature as vector strokes. With `draw` set, it writes itself in stroke
 * by stroke when `draw` turns true; without it, it is simply shown.
 */
export default function Signature({
  draw,
  duration = 2200,
  delay = 0,
  className = "",
}: {
  draw?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  let elapsed = 0;
  return (
    <svg
      viewBox={SIGNATURE.viewBox}
      role="img"
      aria-label="Aawaiz Soomro"
      fill="none"
      stroke="currentColor"
      strokeWidth={SIGNATURE.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {SIGNATURE.strokes.map((s, i) => {
        const time = s.share * duration;
        const start = delay + elapsed;
        elapsed += time;
        if (draw === undefined) return <path key={i} d={s.d} />;
        return (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: draw ? 0 : 1,
              opacity: draw ? 1 : 0,
              transition: draw ? `stroke-dashoffset ${time}ms linear ${start}ms, opacity 1ms linear ${start}ms` : "none",
            }}
          />
        );
      })}
    </svg>
  );
}
