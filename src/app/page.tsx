
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
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
}

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
  const router = useRouter();
  const params = useSearchParams();
  const newHabitParam = params.get("habit");
  const [habits, setHabits] = useState<Habit[]>([]);

   const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    if (typeof window !== 'undefined') {
      localStorage.setItem('habits', JSON.stringify(newHabits));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    }
  }, []);

  useEffect(() => {
    if (newHabitParam) {
      try {
        const newHabit = JSON.parse(decodeURIComponent(newHabitParam));
        
        let updatedHabits = [...habits];
        const existingHabitIndex = updatedHabits.findIndex(
          (h) => h.id.split('-')[0] === newHabit.id.split('-')[0]
        );

        if (existingHabitIndex !== -1) {
           updatedHabits[existingHabitIndex] = newHabit;
        } else {
           updatedHabits.push(newHabit);
        }
        updateHabits(updatedHabits)
        // clean up the URL
        router.replace('/', {scroll: false});

      } catch (error) {
        console.error("Failed to process habit from URL", error);
      }
    }
  }, [newHabitParam, habits, updateHabits, router]);

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
        {habits.length > 0 ? (
          habits.map((habit) => {
            const details = encodeURIComponent(JSON.stringify(habit));
            return (
              <StampCard
                key={habit.id}
                href={`/habit/${habit.id}?details=${details}`}
                {...habit}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No stamps yet.</p>
            <p>Click the '+' button to create one.</p>
          </div>
        )}
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
