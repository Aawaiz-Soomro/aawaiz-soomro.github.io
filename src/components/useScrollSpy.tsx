import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If we're at the very top, default to the first section
      if (window.scrollY < 50) {
        setActiveSection(sectionIds[0] || '');
        return;
      }

      // If we're near the bottom (within 100px), default to the last section
      if (window.scrollY + windowHeight >= documentHeight - 100) {
        setActiveSection(sectionIds[sectionIds.length - 1] || '');
        return;
      }

      // Find which section is currently most visible
      let currentSection = '';
      let maxVisibleArea = 0;
      
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          // Calculate how much of the section is visible in the viewport
          const viewportTop = window.scrollY;
          const viewportBottom = viewportTop + windowHeight;
          
          const visibleTop = Math.max(elementTop, viewportTop);
          const visibleBottom = Math.min(elementBottom, viewportBottom);
          const visibleArea = Math.max(0, visibleBottom - visibleTop);
          
          // If this section has more visible area than previous ones, it's the active one
          if (visibleArea > maxVisibleArea && visibleArea > 100) {
            maxVisibleArea = visibleArea;
            currentSection = sectionId;
          }
        }
      }

      // Fallback: if no section has significant visible area, use the traditional approach
      if (!currentSection) {
        for (const sectionId of sectionIds) {
          const element = document.getElementById(sectionId);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              currentSection = sectionId;
              break;
            }
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
