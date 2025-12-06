import React from "react";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  targetId?: string;
  className?: string;
}

export default function ScrollIndicator({ targetId = "projects", className = "" }: ScrollIndicatorProps) {
  const handleClick = () => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <ChevronDown 
        size={32} 
        className="text-subtext animate-bounce cursor-pointer hover:text-accent-cyan transition-colors duration-200"
        onClick={handleClick}
      />
    </div>
  );
}
