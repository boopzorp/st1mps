"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StampIcon, type StampIconName } from "@/components/icons.tsx";

export interface StampProps {
  day: number;
  stamp: StampIconName;
}

export function Stamp({ day, stamp }: StampProps) {
  const [isStamped, setIsStamped] = useState(false);

  const handleClick = () => {
    setIsStamped(!isStamped);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Day ${day}, ${isStamped ? "stamped" : "unstamped"}`}
      aria-pressed={isStamped}
      className={cn(
        "relative aspect-square w-full rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isStamped
          ? "bg-primary/20 text-primary"
          : "bg-muted/60 text-muted-foreground/50"
      )}
    >
      <span
        className={cn(
          "absolute text-xs font-medium transition-opacity",
          isStamped ? "opacity-0" : "opacity-100"
        )}
      >
        {day}
      </span>
      {isStamped && (
        <div className="animate-stamp-in">
          <StampIcon name={stamp} className="h-2/3 w-2/3" />
        </div>
      )}
    </button>
  );
}
