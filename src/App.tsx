import React, { useEffect, Suspense, lazy } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import About from "@/sections/About";
import MouseGlow from "@/components/MouseGlow";
import ScrollIndicator from "@/components/ScrollIndicator";
import LoadingScreen from "@/components/LoadingScreen";
import { useAssetPreloader } from "@/components/AssetPreloader";
import { preloadCriticalAssets } from "@/components/PerformanceUtils";
import BackToTop from "@/components/BackToTop";

// Lazy load below-the-fold sections
const Projects = lazy(() => import("@/sections/Projects"));
const Research = lazy(() => import("@/sections/Research"));
const Experience = lazy(() => import("@/sections/Experience"));
const Contact = lazy(() => import("@/sections/Contact"));
const Education = lazy(() => import("@/sections/Education"));
const Skills = lazy(() => import("@/sections/Skills"));

export default function App() {
  const { isLoading, progress, loadedAssets, totalAssets } = useAssetPreloader();

  // Preload additional assets once the initial load is complete
  useEffect(() => {
    if (!isLoading) {
      preloadCriticalAssets();
    }
  }, [isLoading]);

  // Show loading screen while assets are loading
  if (isLoading) {
    return (
      <LoadingScreen
        progress={progress}
        loadedAssets={loadedAssets}
        totalAssets={totalAssets}
      />
    );
  }

  return (
    <div className="relative min-h-screen antialiased bg-bg text-text">
      {/* Glow that follows cursor */}
      <MouseGlow />

      {/* Site header */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10">
        <About />
        <ScrollIndicator />
        <Suspense fallback={<div className="h-96" />}>
          <Projects />
          <Skills />
          <Experience />
          <Education />
          <Research />
          <Contact />
        </Suspense>
      </main>

      {/* Back to top button */}
      <BackToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}