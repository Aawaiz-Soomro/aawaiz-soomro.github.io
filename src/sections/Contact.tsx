import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import Wordmark from "@/components/Wordmark";
import { PROFILE, withBase } from "@/data/links";
import { useInView } from "@/lib/hooks";

const LINKS = [
  { label: "GitHub", href: PROFILE.social.github },
  { label: "LinkedIn", href: PROFILE.social.linkedin },
  { label: "Instagram", href: PROFILE.social.instagram },
  { label: "Résumé", href: withBase(PROFILE.resumeUrl)! },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [ref, seen] = useInView<HTMLDivElement>("0px 0px -20% 0px");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line-strong bg-surface pt-20 sm:pt-28">
      <div className="wrap">
        <p className="flex items-center justify-between">
          <span className="tag text-accent">07</span>
          <span className="tag text-muted">Always open to connecting</span>
        </p>

        <h2 id="contact-title" ref={ref} className="mt-6">
          <FitLine text="Let’s connect" kinetic show={seen} />
        </h2>

        <Fade className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
          <p className="max-w-md text-lg leading-relaxed text-muted">
            I’m always open to opportunities in research, internships, or collaboration. Feel free to reach out directly.
          </p>

          <div>
            <div className="flex items-stretch gap-2">
              <a
                href={`mailto:${PROFILE.email}`}
                className="group flex min-h-16 min-w-0 flex-1 items-center justify-between gap-4 rounded-full border border-line-strong px-6 transition-colors duration-200 hover:border-accent sm:px-8"
              >
                <span className="truncate font-mono text-sm sm:text-lg">{PROFILE.email.toLowerCase()}</span>
                <ArrowUpRight className="size-5 shrink-0 text-accent transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={copy}
                className="flex min-h-16 items-center gap-2 rounded-full bg-accent px-5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-on-accent transition-transform duration-200 ease-out active:scale-95 sm:px-7"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <dl className="mt-5 grid grid-cols-[5rem_1fr] gap-y-2 px-2 font-mono text-xs uppercase tracking-[0.06em]">
              <dt className="text-faint">Uni</dt>
              <dd className="normal-case tracking-normal">
                <a href={`mailto:${PROFILE.email2}`} className="hover:text-accent">{PROFILE.email2}</a>
              </dd>
              <dt className="text-faint">Phone</dt>
              <dd>
                <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="hover:text-accent">{PROFILE.phone}</a>
              </dd>
              <dt className="text-faint">Based</dt>
              <dd>{PROFILE.location}</dd>
            </dl>
          </div>
        </Fade>

        <ul className="mt-14 grid grid-cols-2 border-l border-t border-line-strong lg:grid-cols-4">
          {LINKS.map((l) => (
            <li key={l.label} className="border-b border-r border-line-strong">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-24 items-end justify-between overflow-hidden p-4 sm:h-32 sm:p-5"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="display relative text-3xl transition-colors duration-300 group-hover:text-on-accent sm:text-4xl">{l.label}</span>
                <ArrowUpRight className="relative size-6 text-accent transition-[color,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-on-accent" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="wrap mt-16 pb-6">
        <Wordmark large className="mx-auto block w-[min(100%,44rem)] text-ink/90" />
        <div className="mt-6 flex flex-col gap-2 border-t border-line-strong pt-5 font-mono text-xs uppercase tracking-[0.06em] text-faint sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aawaiz. Vibe coded with React &amp; Tailwind.</p>
          <p>Theme inspired by Ayu Mirage.</p>
          <a href="#top" className="text-muted hover:text-accent">Back to top ↑</a>
        </div>
      </footer>
    </section>
  );
}
