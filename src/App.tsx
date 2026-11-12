import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/sections/Hero";
import Work from "@/sections/Work";
import Stack from "@/sections/Stack";
import Timeline from "@/sections/Timeline";
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
      <Work />
      <Stack />
      <Timeline />
      <Contact />
    </main>
  );
}
