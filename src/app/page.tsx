
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
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) {
      return;
    }
    onExpand();
  }

  const numVisibleStamps = isExpanded ? habit.numStamps : 10;

  return (
    <div
      className={cn(
        "relative rounded-lg p-6 transition-all duration-300 ease-in-out h-full flex flex-col justify-between",
        habit.cardClass,
        isExpanded ? 'shadow-2xl' : 'hover:shadow-xl',
        isExpanded ? '' : 'cursor-pointer'
      )}
      onClick={!isExpanded ? handleCardClick : undefined}
    >
      <div>
        <div className="absolute top-2 right-2 z-30">
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
          isExpanded ? 'grid-cols-5 max-h-60' : 'grid-cols-4'
          )}>
          {Array.from({ length: Math.min(habit.numStamps, numVisibleStamps) }).map((_, i) => {
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
          {habit.numStamps > numVisibleStamps && !isExpanded && (
            <div className="aspect-square rounded-full flex items-center justify-center">
              <Ellipsis style={{color: habit.textColor}} />
            </div>
          )}
        </div>
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
        try {
          const parsedHabits = JSON.parse(savedHabits);
          if (Array.isArray(parsedHabits)) {
            setHabits(parsedHabits);
          }
        } catch (e) {
          console.error("Failed to parse habits from localStorage", e);
        }
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
      setExpandedHabitId(null);
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

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    updateHabits(updatedHabits);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`stamps_${habitId}`);
    }
    setExpandedHabitId(null); // Close if expanded
  };

  const handleEditHabit = (habit: Habit) => {
    const details = encodeURIComponent(JSON.stringify(habit));
    router.push(`/new?habit=${details}`);
  };

  const handleExpandToggle = (habitId: string) => {
    setExpandedHabitId(prevId => prevId === habitId ? null : habitId);
  }

  const expandedHabit = habits.find(h => h.id === expandedHabitId);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
        
        <div 
            className={cn(
                "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                expandedHabitId ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setExpandedHabitId(null)}
        />
        
        {expandedHabit && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300"
              onClick={() => handleExpandToggle(expandedHabit.id)}
            >
                <div 
                  className="w-full max-w-md transition-all duration-300" 
                  onClick={(e) => e.stopPropagation()}
                >
                    <StampCard
                        habit={expandedHabit}
                        onDelete={handleDeleteHabit}
                        onEdit={handleEditHabit}
                        isExpanded={true}
                        onExpand={() => handleExpandToggle(expandedHabit.id)}
                        isActive={true}
                    />
                </div>
            </div>
        )}

        <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
            <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
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

            <main className="p-4 flex-1 flex items-center">
                {habits.length > 0 ? (
                    <Carousel 
                        setApi={setApi}
                        opts={{
                            align: "center",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {habits.map((habit, index) => (
                                <CarouselItem 
                                    key={habit.id} 
                                    className={cn(
                                        "pl-4 transition-opacity duration-300",
                                        "basis-5/6",
                                        expandedHabitId && expandedHabitId === habit.id ? 'opacity-0' : 'opacity-100'
                                    )}
                                >
                                    <div className={cn(
                                        "transition-all duration-300",
                                        index !== current ? 'scale-90 opacity-70' : 'scale-100 opacity-100',
                                    )}>
                                        <StampCard
                                            habit={habit}
                                            onDelete={handleDeleteHabit}
                                            onEdit={handleEditHabit}
                                            isExpanded={false}
                                            onExpand={() => handleExpandToggle(habit.id)}
                                            isActive={index === current}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {!expandedHabitId && habits.length > 1 && (
                            <>
                                <CarouselPrevious className="left-[-5px] sm:left-[-15px] z-20"/>
                                <CarouselNext className="right-[-5px] sm:right-[-15px] z-20"/>
                            </>
                        )}
                    </Carousel>
                ) : (
                    <div className="text-center text-gray-500 w-full">
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
