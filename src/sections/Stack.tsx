import { STACK } from "@/data/skills";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="border-y border-line bg-surface py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
        <div>
          <p className="kicker text-signal">~/stack</p>
          <h2 id="stack-title" className="mt-3 font-mono text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-none tracking-[-0.04em]">
            Stack
          </h2>
          <p className="mt-5 max-w-xs text-muted">
            What I reach for, grouped the same way as the field at the top of the page.
          </p>
        </div>

        <dl className="border-t border-line-strong">
          {STACK.map((row) => (
            <div
              key={row.id}
              className="group grid gap-3 border-b border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-8"
            >
              <dt className="flex items-baseline gap-3 font-mono text-sm text-muted">
                <span className="text-signal">{row.id}/</span>
                <span>{row.title}</span>
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xl text-ink sm:text-2xl">
                  {row.items.map((item) => (
                    <li key={item} className="transition-colors duration-150 hover:text-accent-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
