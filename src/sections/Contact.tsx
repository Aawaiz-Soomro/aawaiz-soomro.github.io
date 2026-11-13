import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
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
  const [ref, seen] = useInView<HTMLHeadingElement>("0px 0px -15% 0px");

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
    <section id="contact" aria-labelledby="contact-title" className="bg-surface pt-16 sm:pt-24">
      <div className="wrap">
        <h2 id="contact-title" ref={ref}>
          <FitLine text="Let’s connect" kinetic show={seen} />
        </h2>

        <Fade className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              I’m always open to opportunities in research, internships, or collaboration.
            </p>
            <a
              href={`mailto:${PROFILE.email}`}
              className="mt-5 inline-block break-all border-b border-accent pb-1 text-[clamp(1.25rem,3vw,2.25rem)] font-medium transition-colors duration-200 hover:text-accent"
            >
              {PROFILE.email.toLowerCase()}
            </a>
            <button type="button" onClick={copy} className="ml-4 text-muted transition-colors hover:text-ink" aria-live="polite">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-xl sm:flex sm:flex-wrap lg:justify-end">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-accent">
                  {l.label}
                  <ArrowUpRight className="size-4 text-accent transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </Fade>

        <footer className="mt-16 flex flex-col gap-1 border-t border-line-strong py-6 text-sm text-faint sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aawaiz. Vibe coded with React &amp; Tailwind.</p>
          <p>{PROFILE.location}</p>
        </footer>
      </div>
    </section>
  );
}
