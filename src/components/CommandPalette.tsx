import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Copy,
  FileDown,
  Github,
  Hash,
  Instagram,
  Linkedin,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { PROFILE, SECTIONS, withBase } from "@/data/links";
import { useTheme } from "@/contexts/ThemeContext";
import { PaletteContext } from "@/contexts/PaletteContext";
import { scrollToSection } from "@/lib/scroll";

type Item = {
  id: string;
  group: "Jump to" | "Projects" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  icon: LucideIcon;
  run: () => void;
};

/** Subsequence match; lower score is better, -1 means no match. */
function score(query: string, text: string) {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const direct = t.indexOf(q);
  if (direct >= 0) return direct;
  let ti = 0;
  let gaps = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found < 0) return -1;
    gaps += found - ti;
    ti = found + 1;
  }
  return 100 + gaps;
}

export default function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    d.showModal();
    inputRef.current?.focus();
  }, []);
  const close = () => dialogRef.current?.close();

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  };

  const goSection = useCallback(
    (id: string) => {
      if (location.pathname === "/" && scrollToSection(id)) return;
      navigate(`/#${id}`);
    },
    [location.pathname, navigate]
  );

  const items = useMemo<Item[]>(() => {
    const ext = (url: string) => () => window.open(url, "_blank", "noopener");
    return [
      ...SECTIONS.map((s) => ({
        id: `section-${s.id}`,
        group: "Jump to" as const,
        label: s.label,
        hint: `~/${s.id}`,
        icon: Hash,
        run: () => goSection(s.id),
      })),
      ...PROJECTS.map((p) => ({
        id: `project-${p.slug}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.tags.slice(0, 2).join(", "),
        icon: ArrowRight,
        run: () => navigate(`/projects/${p.slug}`),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: PROFILE.email,
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email).then(
            () => notify("Email copied"),
            () => notify(PROFILE.email)
          );
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "Download résumé",
        hint: "PDF",
        icon: FileDown,
        run: ext(withBase(PROFILE.resumeUrl)!),
      },
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        icon: theme === "dark" ? Sun : Moon,
        run: toggleTheme,
      },
      { id: "github", group: "Elsewhere", label: "GitHub", hint: "@aawaiz-soomro", icon: Github, run: ext(PROFILE.social.github) },
      { id: "linkedin", group: "Elsewhere", label: "LinkedIn", icon: Linkedin, run: ext(PROFILE.social.linkedin) },
      { id: "instagram", group: "Elsewhere", label: "Instagram", icon: Instagram, run: ext(PROFILE.social.instagram) },
    ];
  }, [goSection, navigate, theme, toggleTheme]);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((it) => ({ it, s: score(query.trim(), `${it.label} ${it.hint ?? ""}`) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s)
      .map((r) => r.it);
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Cmd/Ctrl+K anywhere, or "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest("input,textarea,[contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const runItem = (it: Item) => {
    close();
    it.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      runItem(results[active]);
    }
  };

  let lastGroup = "";

  return (
    <PaletteContext.Provider value={{ open }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-label="Command menu"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="fixed inset-x-0 top-[12vh] mx-auto w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-2xl shadow-black/40 transition-[opacity,translate,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-black/50 backdrop:backdrop-blur-sm starting:open:-translate-y-2 starting:open:opacity-0"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, project or action…"
            aria-label="Search commands"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            className="h-14 w-full bg-transparent font-mono text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-xs text-muted sm:block">esc</kbd>
        </div>

        <ul ref={listRef} id="palette-results" role="listbox" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted">
              Nothing matches “{query}”. Try a project name or “email”.
            </li>
          )}
          {results.map((it, i) => {
            const header = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            const Icon = it.icon;
            return (
              <li key={it.id} role="presentation">
                {header && <div className="px-3 pb-1.5 pt-3 font-mono text-xs text-faint">{header}</div>}
                <div
                  id={`palette-${it.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => runItem(it)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] ${
                    i === active ? "bg-raised text-ink" : "text-muted"
                  }`}
                >
                  <Icon className={`size-4 shrink-0 ${i === active ? "text-accent-ink" : ""}`} aria-hidden="true" />
                  <span className="truncate">{it.label}</span>
                  {it.hint && <span className="ml-auto truncate pl-4 font-mono text-xs text-faint">{it.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4 border-t border-line px-4 py-2.5 font-mono text-xs text-faint">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
        </div>
      </dialog>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-accent px-4 py-2 font-mono text-sm text-on-accent shadow-lg transition-[opacity,translate] duration-200 ease-out ${
          toast ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {toast}
      </div>
    </PaletteContext.Provider>
  );
}
