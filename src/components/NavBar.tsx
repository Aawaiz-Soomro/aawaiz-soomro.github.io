import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Command, Moon, Sun } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { useTheme } from "@/contexts/ThemeContext";
import { usePalette } from "@/contexts/PaletteContext";
import { SECTIONS } from "@/data/links";
import { useActiveSection } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

const IDS = SECTIONS.map((s) => s.id);
const NONE: string[] = [];

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const { open } = usePalette();
  const { pathname } = useLocation();
  const home = pathname === "/";
  const active = useActiveSection(home ? IDS : NONE);
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(true);

  // Sliding underline under the active link.
  const linksRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = linksRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    setBar(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [active]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || !home ? "border-b border-line bg-bg/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="wrap flex h-16 items-center gap-6">
        <Link to="/" aria-label="Home" className="mr-auto text-ink transition-colors hover:text-accent-ink">
          <Wordmark className="h-8" />
        </Link>

        <div ref={linksRef} className="relative hidden items-center md:flex">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/#${s.id}`}
              data-id={s.id}
              onClick={(e) => {
                if (home && scrollToSection(s.id)) e.preventDefault();
              }}
              aria-current={active === s.id ? "location" : undefined}
              className={`px-3 py-2 font-mono text-sm transition-colors duration-200 hover:text-ink ${
                active === s.id ? "text-ink" : "text-muted"
              }`}
            >
              {s.label}
            </Link>
          ))}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 h-0.5 rounded-full bg-accent transition-[left,width,opacity] duration-300 ease-out"
            style={{ left: (bar?.left ?? 0) + 12, width: Math.max(0, (bar?.width ?? 0) - 24), opacity: bar ? 1 : 0 }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            className="flex h-10 items-center gap-2 rounded-lg border border-line bg-surface/60 px-3 font-mono text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline">Jump to</span>
            <kbd className="hidden items-center gap-0.5 rounded border border-line px-1 text-xs md:flex">
              {isMac ? <Command className="size-3" aria-label="Command" /> : "Ctrl "}K
            </kbd>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="grid size-10 place-items-center rounded-lg border border-line bg-surface/60 text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
