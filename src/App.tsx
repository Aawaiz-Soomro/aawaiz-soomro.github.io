import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
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
      <About />
      <Projects />
      <Fyp />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
