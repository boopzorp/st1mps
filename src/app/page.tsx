
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";


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
  onDelete,
  onEdit,
  isExpanded,
  onExpand,
  isActive,
}: {
  habit: Habit;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  isExpanded: boolean;
  onExpand: () => void;
  isActive: boolean;
}) {
  const [stamped, setStamped] = useState<number[]>([]);

  useEffect(() => {
    const savedStamps = localStorage.getItem(`stamps_${habit.id}`);
    setStamped(savedStamps ? JSON.parse(savedStamps) : []);
  }, [habit.id]);
  
  const toggleStamp = (day: number) => {
    const newStamped = stamped.includes(day)
      ? stamped.filter((d) => d !== day)
      : [...stamped, day];
    setStamped(newStamped);
    localStorage.setItem(`stamps_${habit.id}`, JSON.stringify(newStamped));
  };

  const progressPercent = habit.numStamps > 0 ? Math.round((stamped.length / habit.numStamps) * 100) : 0;
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Let clicks on buttons pass through
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) {
      return;
    }
    onExpand();
  }

  const numVisibleStamps = isExpanded ? habit.numStamps : 11;

  return (
    <div
      className={cn(
        "relative rounded-lg p-6 transition-all duration-300 ease-in-out cursor-pointer",
        isExpanded ? 'transform scale-105 shadow-2xl z-20' : 'hover:transform hover:scale-105 hover:shadow-2xl hover:z-10',
        habit.cardClass,
        isActive && !isExpanded ? 'z-10' : 'z-0'
      )}
      onClick={handleCardClick}
    >
       <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" style={{color: habit.textColor}}>
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
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
                  <AlertDialogAction onClick={() => onDelete(habit.id)} className={cn("bg-red-500 hover:bg-red-600")}>Delete</AlertDialogAction>
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
        {habit.subtitle} | {progressPercent}% Complete
      </p>
      <div className={cn(
        "mt-6 grid gap-3 transition-all duration-300 overflow-y-auto",
        isExpanded ? 'grid-cols-4 max-h-60' : 'grid-cols-4'
        )}>
        {Array.from({ length: numVisibleStamps }).map((_, i) => {
          const day = i + 1;
          const isStamped = stamped.includes(day);
          return (
             <button
              key={i}
              onClick={(e) => { e.stopPropagation(); toggleStamp(day); }}
              className={cn(
                "aspect-square rounded-full flex items-center justify-center border-2 border-dashed transition-all",
                isStamped
                  ? "border-transparent"
                  : "border-black/20"
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
         {habit.numStamps > 11 && !isExpanded && (
          <div className="aspect-square rounded-full flex items-center justify-center">
             <Ellipsis style={{color: habit.textColor}} />
          </div>
        )}
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
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

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
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }
    
    api.on("select", handleSelect)
 
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

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
                // If ID is new but root is same, it's an edit, so remove old stamps
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

        // Clean the URL
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

  const handleExpandToggle = (habitId: string) => {
    setExpandedHabitId(prevId => prevId === habitId ? null : habitId);
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {expandedHabitId && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
            onClick={() => setExpandedHabitId(null)}
          />
        )}
        <div className="max-w-md mx-auto relative">
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
      <main className="p-4">
        {habits.length > 0 ? (
          <Carousel 
            setApi={setApi}
            opts={{
              align: "center",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {habits.map((habit, index) => (
                <CarouselItem key={habit.id} className="pl-1 md:basis-full" style={{transform: `translateX(${(index - current) * 10}px) scale(${1 - Math.abs(index-current) * 0.1})`, transition: 'transform 0.3s ease-out', zIndex: habits.length - Math.abs(index-current)}}>
                  <div className="p-1">
                    <StampCard
                      habit={habit}
                      onDelete={handleDeleteHabit}
                      onEdit={handleEditHabit}
                      isExpanded={expandedHabitId === habit.id}
                      onExpand={() => handleExpandToggle(habit.id)}
                      isActive={index === current}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {habits.length > 1 && !expandedHabitId && (
              <>
                <CarouselPrevious className="left-[-10px] sm:left-[-20px]"/>
                <CarouselNext className="right-[-10px] sm:right-[-20px]"/>
              </>
            )}
          </Carousel>
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

    