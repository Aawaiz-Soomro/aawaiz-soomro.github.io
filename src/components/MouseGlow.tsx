import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "@/data/theme";

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const glowColor = theme === 'dark' ? DARK_THEME.mouseGlow : LIGHT_THEME.mouseGlow;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition duration-300"
      style={{
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 80%)`,
      }}
    />
  );
}