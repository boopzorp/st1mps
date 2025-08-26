
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StampIcon } from "@/components/icons";
import { useSearchParams, useRouter } from "next/navigation";


export default function HabitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitDetails = searchParams.get('details');

  let habit;
  if (habitDetails) {
    habit = JSON.parse(habitDetails);
  }

  const [stamped, setStamped] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && habit) {
      const savedStamps = localStorage.getItem(`stamps_${habit.id}`);
      return savedStamps ? JSON.parse(savedStamps) : [];
    }
    return [];
  });

  useEffect(() => {
     if (typeof window !== 'undefined' && habit) {
      localStorage.setItem(`stamps_${habit.id}`, JSON.stringify(stamped));
    }
  }, [stamped, habit]);

  const toggleStamp = (day: number) => {
    setStamped((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEdit = () => {
    const details = encodeURIComponent(JSON.stringify(habit));
    router.push(`/new?habit=${details}`);
  };

  if (!habit) {
      return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
              <p>Habit not found.</p>
              <Link href="/" className={cn(buttonVariants({variant: 'link'}), "mt-4")}>Go back home</Link>
          </div>
      )
  }

  const stampNext = () => {
    const nextUnstamped = Array.from({ length: habit.numStamps }, (_, i) => i + 1)
                                .find(day => !stamped.includes(day));
    if(nextUnstamped) {
      toggleStamp(nextUnstamped);
    }
  }


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-white hover:bg-zinc-800"
          )}
        >
          <ChevronLeft />
        </Link>
        <Button
          variant="ghost"
          className="text-white hover:bg-zinc-800 hover:text-white"
          onClick={handleEdit}
        >
          Edit
        </Button>
      </header>
      <main className="flex-1 flex flex-col justify-between p-4">
        <div
          className={cn(
            "rounded-lg p-6 text-black",
            habit.cardClass
          )}
        >
          <h2
            className={cn(
              "text-5xl font-bold",
              habit.titleClass
            )}
            style={{color: habit.textColor}}
          >
           <span className={cn(habit.line1Font)}>{habit.titleLine1}</span>
           <br />
           <span className={cn(habit.line2Font)}>{habit.titleLine2}</span>
          </h2>
          <p className="mt-2 text-sm opacity-60">
            {habit.subtitle}
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {Array.from({ length: habit.numStamps }).map((_, i) => {
              const day = i + 1;
              const isStamped = stamped.includes(day);
              return (
                <button
                  key={i}
                  onClick={() => toggleStamp(day)}
                  className={cn(
                    "aspect-square rounded-full flex items-center justify-center border-2 border-dashed",
                    isStamped
                      ? "border-transparent"
                      : "border-black/20"
                  )}
                  style={{backgroundColor: isStamped ? habit.textColor: 'transparent', borderColor: `${habit.textColor}40`}}
                >
                  {isStamped ? (
                    <StampIcon
                      name={"check"}
                      className="text-white h-6 w-6"
                    />
                  ) : (
                    <span className="text-sm opacity-50" style={{color: habit.textColor}}>{day}</span>
                  )}
                </button>
              );
            })}
          </div>
          <p
            className={cn(
              "mt-6 text-sm text-center opacity-60"
            )}
            style={{color: habit.textColor}}
          >
            {habit.description}
          </p>
        </div>

        <div className="py-4">
          <Button className="w-full h-14 rounded-full bg-white text-black text-2xl font-semibold hover:bg-gray-200" onClick={stampNext}>
            Stamp
          </Button>
        </div>
      </main>
    </div>
  );
}
