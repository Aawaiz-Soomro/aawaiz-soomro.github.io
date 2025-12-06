import React from "react";
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-_=:;<>/?";
import Section from "@/components/Section";
import Container from "@/components/Container";
import TypingEffect from "@/components/TypingEffect";
import avatarFile from "@/assets/new-avatar.jpg";
import { Mail, Phone, MapPin, Github, Linkedin, Download } from "lucide-react";
import logoFile from "@/assets/Aawaiz.S-Logo.png";
import { PROFILE } from "@/data/links";


const STATUS_MESSAGES = [
  "life.",
  "fyp.",
  "finals.",
  "Everything AI.",
];

const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`;


function useGlitchCycle(messages: string[], dwellMs = 2000, scrambleMs = 450) {
  const [idx, setIdx] = React.useState(0);
  const [text, setText] = React.useState(messages[0] ?? "");

  React.useEffect(() => {
    if (!messages.length) return;
    let raf: number | null = null;
    let dwellTimer: number | null = null;

    const startScramble = () => {
      const from = messages[idx] ?? "";
      const to = messages[(idx + 1) % messages.length] ?? "";
      const maxLen = Math.max(from.length, to.length);
      if (scrambleMs <= 0) {
        // No scramble: immediately switch to next text after dwell
        setText(to);
        setIdx((i) => (i + 1) % messages.length);
        schedule();
        return;
      }
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / scrambleMs);
        const reveal = Math.floor(t * maxLen);
        let out = "";
        for (let i = 0; i < maxLen; i++) {
          if (i < reveal) {
            out += to[i] ?? " ";
          } else {
            out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        }
        setText(out);
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setIdx((i) => (i + 1) % messages.length);
          setText(to);
          schedule();
        }
      };

      raf = requestAnimationFrame(step);
    };

    const schedule = () => {
      dwellTimer = window.setTimeout(startScramble, dwellMs);
    };

    // initialize current text and schedule first scramble
    setText(messages[idx] ?? "");
    schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [idx, messages, dwellMs, scrambleMs]);

  return { text };
}

function useIsMdUp() {
  const [md, setMd] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });
  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setMd(e.matches);
    mql.addEventListener?.('change', handler);
    // Safari fallback
    // @ts-ignore
    mql.addListener?.(handler);
    return () => {
      mql.removeEventListener?.('change', handler);
      // @ts-ignore
      mql.removeListener?.(handler);
    };
  }, []);
  return md;
}

export default function About() {
  const isMdUp = useIsMdUp();
  const { text } = useGlitchCycle(STATUS_MESSAGES, 2000, isMdUp ? 450 : 0);
  const [avatarLoaded, setAvatarLoaded] = React.useState(false);

  return (
    <Section id="about">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-5 md:items-center md:gap-12 md:py-5">
          <div className="md:col-span-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl mb-2 mt-1">
              <div className="relative h-[1.5em] w-32 sm:w-40 lg:w-48">
                <img src={logoFile} alt={PROFILE.name} className="h-full w-auto opacity-0" />
                <div
                  className="absolute inset-0 bg-current"
                  style={{
                    maskImage: `url(${logoFile})`,
                    WebkitMaskImage: `url(${logoFile})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'left center',
                    WebkitMaskPosition: 'left center',
                  }}
                />
              </div>
            </h1>

            {/* Typing line */}
            <p className="mt-2 text-xl lg:text-2xl text-accent-cyan">
              <TypingEffect words={PROFILE.titles} />
            </p>

            <p className="mt-6 max-w-2xl leading-relaxed text-subtext whitespace-pre-line">
              {PROFILE.tagline}
            </p>

            {/* Resume button */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className={`resume-button inline-flex items-center gap-2 rounded-2xl border border-border bg-panel px-4 py-2 text-sm text-accent-white transition-colors hover:border-accent-cyan hover:text-accent-cyan`}
              >
                Résumé
                <Download className="size-4" />
              </a>
            </div>
          </div>

          {/* Avatar panel */}
          <div className="group relative rotate-0 md:rotate-3 rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-300 ease-out hover:rotate-0 hover:scale-105 hover:border-accent-cyan shadow-xl hover:shadow-2xl hover:shadow-accent-cyan/20 max-w-[320px] mx-auto w-full backdrop-blur-sm md:col-span-2">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              {!avatarLoaded && (
                <div className="absolute inset-0 bg-panel animate-pulse" />
              )}
              <img
                src={avatarFile}
                alt="Headshot"
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${avatarLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoad={() => setAvatarLoaded(true)}
                onError={() => setAvatarLoaded(true)}
              />

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Status indicator icon */}
              <div className="absolute bottom-4 right-4">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-cyan"></span>
                </span>
              </div>
            </div>

            <div className="mt-5 text-center pb-2">
              <p className="text-sm font-medium text-subtext uppercase tracking-widest mb-2">
                Currently hacking on
              </p>
              <div className="h-8 flex items-center justify-center overflow-hidden">
                <span className="font-mono text-xl font-bold text-accent-cyan">
                  {text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
