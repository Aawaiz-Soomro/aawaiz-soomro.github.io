import React from "react";
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-_=:;<>/?";
import Section from "@/components/Section";
import Container from "@/components/Container";
import TypingEffect from "@/components/TypingEffect";
import avatarFile from "@/assets/new-avatar.jpg?w=600&format=webp&quality=75";
import avatarSrcset from "@/assets/new-avatar.jpg?as=srcset&w=300;600;900&format=webp";
import { Mail, Phone, MapPin, Github, Linkedin, Download } from "lucide-react";
import logoFile from "@/assets/Aawaiz.S-Logo.png?w=400&format=webp&quality=75";
import { PROFILE } from "@/data/links";


const STATUS_MESSAGES = [
  "life.",
  "fyp.",
  "finals.",
  "Everything AI.",
];


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
    <Section id="about" className="!pt-10 md:!pt-16">
      <Container>
        <div className="flex flex-col-reverse gap-6 py-2 md:py-5 md:grid md:grid-cols-5 md:items-center md:gap-12">
          <div className="md:col-span-3 text-center md:text-left">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl mb-2 mt-1">
              <div className="relative h-[1.5em] w-32 sm:w-40 lg:w-48 mx-auto md:mx-0">
                <img src={logoFile} alt={PROFILE.name} className="h-full w-auto opacity-0" loading="eager" fetchPriority="high" width={400} height={150} />
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
            <p className="mt-2 text-xl lg:text-2xl text-accent-cyan overflow-hidden break-words">
              <TypingEffect words={PROFILE.titles} />
            </p>

            {/* Tagline - clean typography */}
            {isMdUp ? (
              <p className="mt-6 max-w-2xl leading-relaxed text-subtext whitespace-pre-line">
                {PROFILE.tagline}
              </p>
            ) : (
              <p className="mt-5 text-[15px] leading-7 text-subtext">
                Hi. I'm Aawaiz, a CS student at NUCES-FAST building scalable backend systems, cloud infrastructure and AI solutions.
              </p>
            )}

            {/* Say Hi button - glassmorphism style matching site aesthetic */}
            <div className="mt-8 md:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://www.linkedin.com/in/aawaiz-soomro/"
                target="_blank"
                rel="noreferrer"
                className="resume-button group inline-flex items-center justify-center gap-2.5 
                  rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10
                  px-6 py-3 text-sm text-subtext
                  hover:bg-white/10 hover:border-white/20 hover:text-text
                  active:scale-[0.98] transition-all duration-300
                  md:px-4 md:py-2
                  touch-feedback"
              >
                <Linkedin className="size-4 group-hover:animate-bounce" />
                <span>Say Hi</span>
              </a>
            </div>
          </div>

          {/* Avatar panel - shows first on mobile, responsive to viewport */}
          <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-3 md:p-4 transition-all duration-300 ease-out md:rotate-3 hover:rotate-0 hover:scale-105 hover:border-accent-cyan shadow-xl hover:shadow-2xl hover:shadow-accent-cyan/20 w-[60vw] max-w-[240px] md:w-full md:max-w-[320px] mx-auto backdrop-blur-sm md:col-span-2">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-h-[45vh] md:max-h-none">
              {!avatarLoaded && (
                <div className="absolute inset-0 bg-panel animate-pulse" />
              )}
              <img
                src={avatarFile}
                srcSet={avatarSrcset}
                sizes="(max-width: 768px) 100vw, 320px"
                alt="Headshot"
                loading="eager"
                fetchPriority="high"
                width={600}
                height={750}
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${avatarLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoad={() => setAvatarLoaded(true)}
                onError={() => setAvatarLoaded(true)}
              />

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Status indicator - static, no pulse on mobile */}
              <div className="absolute bottom-4 right-4 hidden md:block">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-cyan"></span>
                </span>
              </div>
            </div>

            {/* Status text - hidden on mobile */}
            <div className="hidden md:block mt-5 text-center pb-2">
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
