import { Routes, Route } from "react-router-dom";
import App from "@/App";
import ProjectDetail from "@/components/ProjectDetail";
import NavBar from "@/components/NavBar";
import CommandPaletteProvider from "@/components/CommandPalette";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function AppRoutes() {
  return (
    <ThemeProvider>
      <CommandPaletteProvider>
        <a
          href="#work"
          className="sr-only z-[70] rounded-lg bg-accent px-4 py-2 font-mono text-sm text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <NavBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<App />} />
        </Routes>
      </CommandPaletteProvider>
    </ThemeProvider>
  );
}
