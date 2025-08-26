"use client";

import { useState, useEffect } from "react";
import { Controls, type Config } from "@/components/controls";
import { StampTracker } from "@/components/stamp-tracker";
import { Card } from "@/components/ui/card";
import { StampIconName } from "@/components/icons.tsx";
import { colorThemes } from "@/lib/themes";

const fontMap: { [key: string]: string } = {
  inter: "font-sans",
  "playfair-display": "font-playfair",
  "roboto-slab": "font-roboto-slab",
};

export default function Home() {
  const [config, setConfig] = useState<Config>({
    title: "I will read a book everyday",
    days: 60,
    font: "inter",
    stamp: "star",
    color: "navy-purple",
  });

  useEffect(() => {
    const selectedTheme = colorThemes.find((t) => t.name === config.color);
    if (selectedTheme) {
      const root = document.documentElement;
      root.style.setProperty(
        "--primary",
        `${selectedTheme.primary.h} ${selectedTheme.primary.s}% ${selectedTheme.primary.l}%`
      );
      root.style.setProperty(
        "--primary-foreground",
        `${selectedTheme.primaryForeground.h} ${selectedTheme.primaryForeground.s}% ${selectedTheme.primaryForeground.l}%`
      );
      root.style.setProperty(
        "--ring",
        `${selectedTheme.ring.h} ${selectedTheme.ring.s}% ${selectedTheme.ring.l}%`
      );
    }
  }, [config.color]);

  const handleConfigChange = (newConfig: Partial<Config>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const fontClass = fontMap[config.font] || "font-sans";

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 p-6 sticky top-8">
          <Controls config={config} onConfigChange={handleConfigChange} />
        </Card>
        <div className="md:col-span-2">
          <StampTracker
            title={config.title}
            days={config.days}
            fontClass={fontClass}
            stamp={config.stamp as StampIconName}
            key={`${config.days}-${config.stamp}-${config.color}`}
          />
        </div>
      </div>
    </main>
  );
}
