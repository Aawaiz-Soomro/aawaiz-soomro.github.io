import { useEffect, useState } from "react";

const GLITCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+-_=:;<>/?";

export const randomGlyph = () =>
  GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

/** True when the visitor asked the OS for reduced motion. */
export function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Cycles through messages, scrambling characters between them.
 * With reduced motion the text swaps without the scramble.
 */
export function useGlitchCycle(messages: string[], dwellMs = 2200, scrambleMs = 450) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(messages[0] ?? "");

  useEffect(() => {
    if (messages.length < 2) return;
    let raf = 0;
    const duration = reduced ? 0 : scrambleMs;

    const timer = window.setTimeout(() => {
      const to = messages[(idx + 1) % messages.length];
      const start = performance.now();
      const step = (now: number) => {
        const t = duration ? Math.min(1, (now - start) / duration) : 1;
        const reveal = Math.floor(t * to.length);
        let out = "";
        for (let i = 0; i < to.length; i++) out += i < reveal ? to[i] : randomGlyph();
        setText(out);
        if (t < 1) raf = requestAnimationFrame(step);
        else setIdx((i) => (i + 1) % messages.length);
      };
      raf = requestAnimationFrame(step);
    }, dwellMs);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [idx, messages, dwellMs, scrambleMs, reduced]);

  return text;
}

/** Id of the section currently under the top 35% line of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom of the page the last section is the active one.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

/** Adds true once the element has scrolled into view. */
export function useInView<T extends Element>(margin = "0px 0px -12% 0px") {
  const [el, setEl] = useState<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, seen, margin]);
  return [setEl, seen] as const;
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatch(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return match;
}
