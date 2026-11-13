import { useState } from "react";
import { ArrowUpRight, Check, Copy, FileDown, Github, Instagram, Linkedin } from "lucide-react";
import FitLine from "@/components/FitLine";
import { Fade } from "@/components/Reveal";
import Signature from "@/components/Signature";
import { PROFILE, withBase } from "@/data/links";
import { BLUE, LILAC, MINT, YELLOW } from "@/data/palette";
import { useInView, useMediaQuery } from "@/lib/hooks";

const LINKS = [
  { label: "GitHub", handle: "@aawaiz-soomro", href: PROFILE.social.github, icon: Github, color: MINT },
  { label: "LinkedIn", handle: "/in/aawaiz-soomro", href: PROFILE.social.linkedin, icon: Linkedin, color: BLUE },
  { label: "Instagram", handle: "@aawaizsoomro", href: PROFILE.social.instagram, icon: Instagram, color: LILAC },
  { label: "Résumé", handle: "PDF", href: withBase(PROFILE.resumeUrl)!, icon: FileDown, color: YELLOW },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const wide = useMediaQuery("(min-width: 768px)");
  const [ref, seen] = useInView<HTMLHeadingElement>("0px 0px -15% 0px");
  const [sigRef, sigSeen] = useInView<HTMLDivElement>("0px 0px -18% 0px");

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
    <section id="contact" aria-labelledby="contact-title" className="pt-16 sm:pt-24">
      <div className="wrap">
        <h2 id="contact-title" ref={ref}>
          {wide ? (
            <FitLine text="Let’s connect" show={seen} />
          ) : (
            <>
              <FitLine text="Let’s" show={seen} />
              <FitLine text="connect" outline show={seen} delay={250} />
            </>
          )}
        </h2>

        <Fade className="mt-8">
          <p className="max-w-md text-lg leading-relaxed text-muted">
            I’m always open to opportunities in research, internships, or collaboration.
          </p>
          <div className="mt-6 flex items-stretch gap-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="group flex min-h-16 min-w-0 flex-1 items-center justify-between gap-3 rounded-full border-2 border-ink px-5 transition-colors duration-300 hover:bg-ink hover:text-bg sm:px-8"
            >
              <span className="truncate text-base font-medium sm:text-2xl">{PROFILE.email.toLowerCase()}</span>
              <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 ease-out group-hover:rotate-45 sm:size-7" />
            </a>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy email address"
              className="grid min-h-16 min-w-16 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-200 ease-out hover:scale-105 active:scale-90"
            >
              {copied ? <Check className="size-6" /> : <Copy className="size-6" />}
            </button>
          </div>
          <p aria-live="polite" className="mt-2 h-5 pl-6 text-sm text-accent">
            {copied ? "Copied to clipboard" : ""}
          </p>
        </Fade>

        {/* Social links as coloured tiles */}
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {LINKS.map(({ label, handle, href, icon: Icon, color }, i) => (
            <li key={label}>
              <Fade delay={i * 90}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex aspect-[5/4] flex-col justify-between rounded-[2rem] p-4 text-paper-ink transition-transform duration-500 ease-out hover:-translate-y-2 active:scale-95 sm:p-5"
                  style={{ backgroundColor: color }}
                >
                  <span className="flex items-start justify-between">
                    <Icon className="size-8 transition-transform duration-500 ease-out group-hover:scale-125 sm:size-10" aria-hidden="true" />
                    <span className="grid size-9 place-items-center rounded-full bg-paper-ink text-white transition-transform duration-500 ease-out group-hover:rotate-45 sm:size-11">
                      <ArrowUpRight className="size-4 sm:size-5" />
                    </span>
                  </span>
                  <span>
                    <span className="display block text-[clamp(1.75rem,4.2vw,3.25rem)]">{label}</span>
                    <span className="mt-1 block truncate font-mono text-[11px] opacity-70 sm:text-xs">{handle}</span>
                  </span>
                </a>
              </Fade>
            </li>
          ))}
        </ul>

        {/* The signature is written out when the page reaches the end. */}
        <div ref={sigRef} className="mt-14 sm:mt-20">
          <Signature draw={sigSeen} duration={2400} className="mx-auto block w-[min(100%,42rem)] text-accent" />
        </div>

        <footer className="mt-8 flex flex-col gap-1 border-t border-line-strong py-6 text-sm text-faint sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aawaiz. Vibe coded with React &amp; Tailwind.</p>
          <p>{PROFILE.location}</p>
        </footer>
      </div>
    </section>
  );
}
