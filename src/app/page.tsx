
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

function StampCard({
  href,
  titleLine1,
  titleLine2,
  titleClass,
  subtitle,
  description,
  cardClass,
  numStamps,
  textColor,
  line1Font,
  line2Font,
}: {
  href: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  cardClass: string;
  titleClass: string;
  numStamps: number;
  textColor: string;
  line1Font: string;
  line2Font: string;
}) {
  return (
    <Link href={href} className="block">
      <div className={`rounded-lg p-6 ${cardClass}`}>
        <h2
          className={`text-5xl font-bold ${titleClass}`}
          style={{ color: textColor }}
        >
          <span className={cn(line1Font)}>{titleLine1}</span>
          <br />
          <span className={cn(line2Font)}>{titleLine2}</span>
        </h2>
        <p className="mt-2 text-sm opacity-60" style={{ color: textColor }}>
          {subtitle}
        </p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {Array.from({ length: numStamps }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: `${textColor}40` }}
            >
              <span className="text-sm opacity-50" style={{ color: textColor }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
        <p
          className="mt-6 text-sm text-center opacity-60"
          style={{ color: textColor }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

function HomePageContent() {
  const params = useSearchParams();
  const newHabit = params.get("habit");
  const habitData = newHabit ? JSON.parse(newHabit) : null;

  const defaultHabits = [
    {
      id: "camera",
      titleLine1: "GET A NEW",
      titleLine2: "CAMERA",
      line1Font: "font-sans",
      line2Font: "font-vt323",
      subtitle: "26 days | 19:10:59",
      description:
        "buy a canon g7x if you complete 12 design projects by 7th March",
      cardClass: "bg-[#F3F0E6]",
      titleClass: "",
      numStamps: 12,
      textColor: "#3B6EC5",
    },
    {
      id: "travel",
      titleLine1: "Travel To",
      titleLine2: "HONG KONG",
      line1Font: "font-playfair",
      line2Font: "font-playfair",
      subtitle: "2m 20d | 19:10:59",
      description: "",
      cardClass: "bg-[#F8D8D8]",
      titleClass: "text-black",
      numStamps: 12,
      textColor: "#000000",
    },
  ];

  const habits = habitData
    ? [habitData, ...defaultHabits.filter((d) => d.id !== habitData.id)]
    : defaultHabits;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-playfair text-4xl">Stamps</h1>
        <Button
          size="icon"
          className="rounded-full bg-white text-black"
          asChild
        >
          <Link href="/new">
            <Plus />
          </Link>
        </Button>
      </header>
      <main className="p-4 space-y-8">
        {habits.map((habit) => (
          <StampCard
            key={habit.id}
            href={`/habit/${habit.id}`}
            titleLine1={habit.titleLine1}
            titleLine2={habit.titleLine2}
            subtitle={habit.subtitle}
            description={habit.description}
            cardClass={habit.cardClass}
            titleClass={habit.titleClass}
            numStamps={habit.numStamps}
            textColor={habit.textColor}
            line1Font={habit.line1Font}
            line2Font={habit.line2Font}
          />
        ))}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
