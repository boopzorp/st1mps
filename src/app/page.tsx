
"use client";

import Link from "next/link";
import { Ellipsis, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { StampIcon, StampIconName } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  stampLogo: StampIconName;
  createdAt: string; // ISO string
  endDate?: string; // ISO string
}

function StampCard({
  habit,
  onUpdateStamps,
  onDelete,
  onEdit,
}: {
  habit: Habit;
  onUpdateStamps: (habitId: string, stamps: number[]) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}) {
  const [stamped, setStamped] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const savedStamps = localStorage.getItem(`stamps_${habit.id}`);
    setStamped(savedStamps ? JSON.parse(savedStamps) : []);
  }, [habit.id]);

  const toggleStamp = (day: number) => {
    const newStamped = stamped.includes(day)
      ? stamped.filter((d) => d !== day)
      : [...stamped, day];
    setStamped(newStamped);
    onUpdateStamps(habit.id, newStamped);
  };
  
  const handleCardClick = () => {
    setIsActive(true);
  };
  
  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <div
      className={`relative rounded-lg p-6 transition-transform duration-300 ${isActive ? 'transform scale-105 shadow-2xl z-10' : ''} ${habit.cardClass}`}
      onClick={handleCardClick}
      onMouseLeave={handleMouseLeave}
    >
       <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" style={{color: habit.textColor}}>
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); onEdit(habit)}}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    stamp card and all its progress.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(habit.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h2
        className={`text-5xl font-bold ${habit.titleClass}`}
        style={{ color: habit.textColor }}
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
              onClick={(e) => {e.stopPropagation(); toggleStamp(day)}}
              className={cn(
                "aspect-square rounded-full flex items-center justify-center border-2 border-dashed transition-all",
                isStamped
                  ? "border-transparent"
                  : "border-black/20",
                isActive ? 'scale-110' : ''
              )}
              style={{backgroundColor: isStamped ? habit.textColor: 'transparent', borderColor: `${habit.textColor}40`}}
            >
              {isStamped ? (
                <StampIcon
                  name={habit.stampLogo || "check"}
                  className="h-6 w-6"
                   style={{color: habit.cardClass.includes('bg-white') || habit.cardClass.includes('bg-[#F3F0E6]') ? 'black' : 'white'}}
                />
              ) : (
                <span className="text-sm opacity-50" style={{color: habit.textColor}}>{day}</span>
              )}
            </button>
          )
        })}
      </div>
      <p
        className="mt-6 text-sm text-center opacity-60"
        style={{ color: habit.textColor }}
      >
        {habit.description}
      </p>
    </div>
  );
}

function HomePageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const newHabitParam = params.get("habit");
  const habitToDeleteParam = params.get("delete");
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
        
        setHabits(prevHabits => {
            const existingHabitIndex = prevHabits.findIndex(
            (h) => h.id.split('-')[0] === newHabit.id.split('-')[0]
            );

            let updatedHabits;
            if (existingHabitIndex !== -1) {
                updatedHabits = [...prevHabits];
                const oldHabit = updatedHabits[existingHabitIndex];
                if (oldHabit.id !== newHabit.id) {
                   if (typeof window !== 'undefined') {
                      localStorage.removeItem(`stamps_${oldHabit.id}`);
                   }
                }
                updatedHabits[existingHabitIndex] = newHabit;

            } else {
                updatedHabits = [...prevHabits, newHabit];
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('habits', JSON.stringify(updatedHabits));
            }
            return updatedHabits;
        });

        router.replace('/', {scroll: false});

      } catch (error) {
        console.error("Failed to process habit from URL", error);
      }
    }
  }, [newHabitParam, router]);

  useEffect(() => {
    if(habitToDeleteParam) {
      const updatedHabits = habits.filter(h => h.id !== habitToDeleteParam);
      updateHabits(updatedHabits);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`stamps_${habitToDeleteParam}`);
      }
      router.replace('/', {scroll: false});
    }
  }, [habitToDeleteParam, habits, updateHabits, router]);

  const handleUpdateStamps = (habitId: string, newStamps: number[]) => {
    localStorage.setItem(`stamps_${habitId}`, JSON.stringify(newStamps));
  };
  
  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    updateHabits(updatedHabits);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`stamps_${habitId}`);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    const details = encodeURIComponent(JSON.stringify(habit));
    router.push(`/new?habit=${details}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto">
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
          habits.map((habit) => (
            <StampCard
              key={habit.id}
              habit={habit}
              onUpdateStamps={handleUpdateStamps}
              onDelete={handleDeleteHabit}
              onEdit={handleEditHabit}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No stamps yet.</p>
            <p>Click the '+' button to create one.</p>
          </div>
        )}
      </main>
      </div>
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
