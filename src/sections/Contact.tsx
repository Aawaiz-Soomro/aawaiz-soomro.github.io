import { useState } from "react";
import { Check, Copy, FileDown, Github, Instagram, Linkedin } from "lucide-react";
import { PROFILE, withBase } from "@/data/links";

const LINKS = [
  { label: "GitHub", href: PROFILE.social.github, icon: Github },
  { label: "LinkedIn", href: PROFILE.social.linkedin, icon: Linkedin },
  { label: "Instagram", href: PROFILE.social.instagram, icon: Instagram },
  { label: "Résumé", href: withBase(PROFILE.resumeUrl)!, icon: FileDown },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

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
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line bg-surface pb-12 pt-24 sm:pt-32">
      <div className="wrap">
        <p className="kicker text-signal">~/contact</p>
        <h2 id="contact-title" className="mt-3 font-mono text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.95] tracking-[-0.045em]">
          Let’s build
          <br />
          something<span className="text-accent-ink">.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Open to internships, research and backend or AI roles. The fastest way to reach me is email.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="break-all font-mono text-[clamp(1.1rem,3.2vw,2.25rem)] text-ink underline decoration-line-strong decoration-2 underline-offset-[0.3em] transition-colors duration-200 hover:text-accent-ink hover:decoration-accent"
          >
            {PROFILE.email.toLowerCase()}
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong px-3 font-mono text-sm text-muted transition-colors hover:text-ink"
          >
            {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <ul className="mt-14 grid grid-cols-2 border-l border-t border-line sm:grid-cols-4">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label} className="border-b border-r border-line">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-20 items-center justify-between px-5 font-mono text-ink transition-colors duration-200 hover:bg-raised"
              >
                {label}
                <Icon className="size-5 text-muted transition-colors group-hover:text-accent-ink" />
              </a>
            </li>
          ))}
        </ul>

        <footer className="mt-16 flex flex-col gap-2 font-mono text-sm text-faint sm:flex-row sm:justify-between">
          <p>{PROFILE.offline}</p>
          <p>
            © {new Date().getFullYear()} {PROFILE.name}. React, Tailwind, Fira Code and Instrument Sans.
          </p>
        </footer>
      </div>
    </section>
  );
}
