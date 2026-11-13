import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import App from "@/App";
import ProjectDetail from "@/components/ProjectDetail";
import NavBar from "@/components/NavBar";
import Preloader from "@/components/Preloader";
import { ReadyContext } from "@/contexts/ReadyContext";

// The opening plays once per browser session, and never with reduced motion.
function shouldPlayIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem("intro") !== "1";
  } catch {
    return false;
  }
}

export default function AppRoutes() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(() => !intro);
  const reveal = useCallback(() => setReady(true), []);
  const done = useCallback(() => {
    try {
      sessionStorage.setItem("intro", "1");
    } catch {
      /* private mode: the intro simply plays again next time */
    }
    setIntro(false);
  }, []);

  return (
    <ReadyContext.Provider value={ready}>
      <a
        href="#projects"
        className="sr-only z-[95] rounded-full bg-accent px-4 py-2 font-mono text-sm text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {intro && <Preloader onReady={reveal} onDone={done} />}
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<App />} />
      </Routes>
    </ReadyContext.Provider>
  );
}
