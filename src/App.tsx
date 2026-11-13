import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Marquee from "@/components/Marquee";
import Projects from "@/sections/Projects";
import Fyp from "@/sections/Fyp";
import Skills from "@/sections/Skills";
import Experience from "@/sections/Experience";
import Contact from "@/sections/Contact";

export default function App() {
  const { hash } = useLocation();

  // Arriving at /#section (from another page or a shared link) scrolls there.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [hash]);

  return (
    <main>
      <Hero />
      <Marquee className="border-y border-line-strong py-4 sm:py-6">
        {["Backend", "Cloud", "AI engineering", "Full-stack", "Databases"].map((w, i) => (
          <span key={w} className="flex items-center">
            <span className={`display px-5 text-[clamp(2.75rem,8vw,6rem)] ${i % 2 ? "outline-text" : ""}`}>{w}</span>
            <span className="size-3 rotate-45 bg-accent sm:size-4" />
          </span>
        ))}
      </Marquee>
      <About />
      <Projects />
      <Fyp />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
