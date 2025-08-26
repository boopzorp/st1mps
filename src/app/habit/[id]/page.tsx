
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StampIcon } from "@/components/icons";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function HabitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitDetails = searchParams.get('details');

  let habit;
  if (habitDetails) {
    try {
      habit = JSON.parse(decodeURIComponent(habitDetails));
    } catch (e) {
      console.error("Failed to parse habit details from URL", e);
    }
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
    if (habit) {
      const details = encodeURIComponent(JSON.stringify(habit));
      router.push(`/new?habit=${details}`);
    }
  };

  const handleDelete = () => {
    if (habit) {
      router.push(`/?delete=${habit.id}`);
    }
  }

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
    <div className="max-w-md mx-auto w-full">
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
        <div>
        <Button
          variant="ghost"
          className="text-white hover:bg-zinc-800 hover:text-white"
          onClick={handleEdit}
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-white hover:bg-zinc-800 hover:text-white"
            >
              <Trash2 className="text-red-500"/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                stamp card and all its progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className={buttonVariants({variant: 'destructive'})}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
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
          <p className="mt-2 text-sm opacity-60" style={{ color: habit.textColor }}>
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
                      name={habit.stampLogo || "check"}
                      className="text-white h-6 w-6"
                      style={{color: habit.cardClass.includes('bg-white') || habit.cardClass.includes('bg-[#F3F0E6]') ? 'black' : 'white'}}
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
    </div>
  );
}
