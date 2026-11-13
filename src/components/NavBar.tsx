import { useEffect, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import Wordmark from "@/components/Wordmark";
import { PROFILE, SECTIONS } from "@/data/links";
import { useActiveSection } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

const IDS = SECTIONS.map((s) => s.id);
const NONE: string[] = [];

export default function NavBar() {
  const { pathname } = useLocation();
  const home = pathname === "/";
  const active = useActiveSection(home ? IDS : NONE);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (home && scrollToSection(id)) e.preventDefault();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || !home ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-6">
          <Link to="/" aria-label="Home" className="relative z-[60] text-ink transition-colors duration-200 hover:text-accent">
            <Wordmark className="h-9" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/#${s.id}`}
                  onClick={(e) => go(e, s.id)}
                  aria-current={active === s.id ? "location" : undefined}
                  className={`group relative px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-200 ${
                    active === s.id ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                  <span aria-hidden="true" className={`absolute inset-x-3 bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-out ${active === s.id ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative z-[60] flex h-10 items-center gap-3 rounded-full border border-line-strong bg-bg/60 pl-4 pr-3 font-mono text-xs uppercase tracking-[0.08em] text-ink backdrop-blur-md lg:hidden"
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-accent transition-transform duration-300 ease-out ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-accent transition-transform duration-300 ease-out ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-bg px-4 pb-8 pt-24 transition-[clip-path] duration-700 ease-in-out lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="flex-1">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="border-b border-line">
              <Link
                to={`/#${s.id}`}
                onClick={(e) => go(e, s.id)}
                className={`rise py-2 ${open ? "in" : ""}`}
                style={{ "--d": `${open ? 180 + i * 60 : 0}ms` } as CSSProperties}
              >
                <span className="!flex items-baseline gap-3">
                                    <span className="display text-[clamp(2.75rem,15vw,4.5rem)]">{s.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.08em] text-muted">
          <a href={PROFILE.social.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={PROFILE.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${PROFILE.email}`} className="text-accent">Email</a>
        </div>
      </div>
    </>
  );
}
