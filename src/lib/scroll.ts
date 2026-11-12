/** Scrolls to a section on the current page. Returns false if it isn't there. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
  return true;
}
