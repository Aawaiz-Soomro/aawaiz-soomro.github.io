import React, { useMemo, useState } from "react";
import Container from "@/components/Container";
import { useScrollSpy } from "@/components/useScrollSpy";
import { Menu, X, Github, Linkedin, Instagram, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import logoFile from "@/assets/Aawaiz.S-Logo.png";

// Color mapping for buttons - Dark theme (Ayu Mirage)
const darkButtonColors = [
  { border: "#95e6cb", text: "#95e6cb" }, // cyan
  { border: "#d4bfff", text: "#d4bfff" }, // purple  
  { border: "#F06292", text: "#F06292" }, // pink (Skills)
  { border: "#bae67e", text: "#bae67e" }, // green
  { border: "#ffcc66", text: "#ffcc66" }, // yellow
  { border: "#f28779", text: "#f28779" }, // orange
  { border: "#59c2ff", text: "#59c2ff" }, // blue
];

// Color mapping for buttons - Light theme (Cloud)
const lightButtonColors = [
  { border: "#00b7bd", text: "#00b7bd" }, // cyan/blue
  { border: "#7d57c2", text: "#7d57c2" }, // purple  
  { border: "#E91E63", text: "#E91E63" }, // pink (Skills)
  { border: "#678f03", text: "#678f03" }, // green
  { border: "#cc6d00", text: "#cc6d00" }, // orange/yellow
  { border: "#d0372d", text: "#d0372d" }, // red
  { border: "#008abd", text: "#008abd" }, // blue
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => setShowLogo(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buttonColors = theme === 'dark' ? darkButtonColors : lightButtonColors;

  const nav = useMemo(
    () => [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#education" },
      { label: "FYP", href: "#research" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  // Extract section IDs for scrollspy
  const sectionIds = nav.map(item => item.href.replace('#', ''));
  const activeSection = useScrollSpy(sectionIds, 200);

  const navWithAccents = nav.map((item, idx) => {
    const colorIndex = idx % buttonColors.length;
    return {
      ...item,
      colorIndex,
      isActive: activeSection === item.href.replace('#', '') && !hoveredItem,
      isHovered: hoveredItem === item.href,
    };
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur" style={{ backgroundColor: theme === 'dark' ? 'rgba(31,36,48,0.6)' : 'rgba(241,241,241,0.8)' }}>
      <Container>
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Name */}
          <a
            href="#top"
            className={`group relative text-subtext transition-all duration-500 hover:text-accent-cyan ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            aria-label="Aawaiz"
          >
            <div className="relative h-12">
              <img src={logoFile} alt="Aawaiz Logo" className="h-full w-auto opacity-0" />
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
            <span className="sr-only">Aawaiz</span>
          </a>

          {/* Center: Nav */}
          <nav
            className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-4 md:flex"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {navWithAccents.map((n) => {
              const isHighlighted = n.isHovered || n.isActive;
              const colors = buttonColors[n.colorIndex];

              return (
                <a
                  key={n.href}
                  href={n.href}
                  onMouseEnter={() => setHoveredItem(n.href)}
                  className="rounded-xl border px-3 py-1.5 text-sm transition-all duration-300 ease-out"
                  style={{
                    borderColor: isHighlighted ? colors.border : 'var(--color-border)',
                    color: isHighlighted ? colors.text : 'var(--color-subtext)'
                  }}
                >
                  {n.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Theme toggle + Social links */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-subtext hover:text-accent-yellow transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <a
              href="https://github.com/aawaiz-soomro"
              target="_blank"
              rel="noreferrer"
              className="text-subtext hover:text-accent-purple transition-colors"
            >
              <Github className="size-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aawaiz-soomro/"
              target="_blank"
              rel="noreferrer"
              className="text-subtext hover:text-accent-blue transition-colors"
            >
              <Linkedin className="size-5" />
            </a>
            <a
              href="https://www.instagram.com/aawaizsoomro/"
              target="_blank"
              rel="noreferrer"
              className="text-subtext hover:text-accent-red transition-colors"
            >
              <Instagram className="size-5" />
            </a>
          </div>

          {/* Mobile: Theme toggle + menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-border p-2 text-subtext transition-colors hover:border-accent-yellow hover:text-accent-yellow"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-xl border border-border p-2 transition-colors hover:border-accent-purple"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div
            className="grid gap-2 pb-4 md:hidden"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {navWithAccents.map((n) => {
              const isHighlighted = n.isHovered || n.isActive;
              const colors = buttonColors[n.colorIndex];

              return (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setHoveredItem(n.href)}
                  className="rounded-xl border bg-panel px-3 py-2 transition-all duration-500 ease-out"
                  style={{
                    borderColor: isHighlighted ? colors.border : 'var(--color-border)',
                    color: isHighlighted ? colors.text : 'var(--color-subtext)'
                  }}
                >
                  {n.label}
                </a>
              );
            })}
          </div>
        )}
      </Container>
    </header>
  );
}