import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "@/data/theme";

export default function MouseGlow() {
  const glowRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      const glowColor = theme === 'dark' ? DARK_THEME.mouseGlow : LIGHT_THEME.mouseGlow;
      glowRef.current.style.background = `radial-gradient(600px at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [theme]);

  // Initial style
  const initialGlowColor = theme === 'dark' ? DARK_THEME.mouseGlow : LIGHT_THEME.mouseGlow;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-0 transition duration-300"
      style={{
        background: `radial-gradient(600px at 50% 50%, ${initialGlowColor}, transparent 80%)`,
      }}
    />
  );
}