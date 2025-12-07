import React from "react";
import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-10 text-center text-sm opacity-70">
      <Container>
        <div className="flex flex-col gap-2">
          <p>© {new Date().getFullYear()} Aawaiz. Vibe coded with React & Tailwind.</p>
          <p className="text-xs text-subtext">Theme inspired by Ayu Mirage.</p>
        </div>
      </Container>
    </footer>
  );
}