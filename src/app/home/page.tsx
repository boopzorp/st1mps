
"use client";

import Link from "next/link";
import { Ellipsis, Plus, Trash2, Edit, Award, LogOut } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { app } from "@/lib/firebase";


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
  stamped,
  toggleStamp,
  onDelete,
  onEdit,
  isExpanded,
  onExpand,
}: {
  habit: Habit;
  stamped: number[];
  toggleStamp: (day: number) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card expansion when clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, [role="menuitem"], a')) {
      return;
    }
    onExpand();
  };

  const isComplete = habit.numStamps > 0 && stamped.length >= habit.numStamps;
  const progressPercent = habit.numStamps > 0 ? Math.round((stamped.length / habit.numStamps) * 100) : 0;
  
  const numVisibleStamps = isExpanded ? habit.numStamps : 10;
  const cardTextColor = isComplete ? '#422006' : habit.textColor;
  
  return (
    <div
      className={cn(
        "relative rounded-lg p-6 transition-all duration-300 ease-in-out h-full flex flex-col justify-between",
        isComplete ? 'bg-gradient-to-br from-yellow-300 to-amber-400 shadow-amber-500/50' : habit.cardClass,
        !isExpanded && 'hover:shadow-xl'
      )}
      onClick={!isExpanded ? handleCardClick : undefined}
    >
      <div>
        {isComplete && (
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 -rotate-12 shadow-lg">
                <Award className="h-4 w-4"/>
                <span>Completed!</span>
            </div>
        )}
        <div className="absolute top-2 right-2 z-30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" style={{color: cardTextColor}}>
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
          style={{ color: cardTextColor }}
        >
          <span className={cn(habit.line1Font)}>{habit.titleLine1}</span>
          <br />
          <span className={cn(habit.line2Font)}>{habit.titleLine2}</span>
        </h2>
        <p className="mt-2 text-sm opacity-60" style={{ color: cardTextColor }}>
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
                  "relative aspect-square rounded-full flex items-center justify-center border-2 border-dashed transition-all",
                  isStamped
                    ? "border-transparent"
                    : "border-black/20"
                )}
                style={{backgroundColor: isStamped ? cardTextColor: 'transparent', borderColor: `${cardTextColor}40`}}
              >
                <StampIcon
                    name={habit.stampLogo || "check"}
                    className={cn("h-6 w-6 transition-all duration-300 transform", isStamped ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}
                    style={{color: isComplete ? '#fde047' : (habit.cardClass.includes('bg-white') || habit.cardClass.includes('bg-[#F3F0E6]') ? 'black' : 'white')}}
                  />
                {!isStamped && (
                  <span className="absolute text-sm opacity-50" style={{color: cardTextColor}}>{day}</span>
                )}
              </button>
            )
          })}
          {habit.numStamps > numVisibleStamps && !isExpanded && (
            <div className="aspect-square rounded-full flex items-center justify-center">
              <Ellipsis style={{color: cardTextColor}} />
            </div>
          )}
        </div>
      </div>
      <p
        className="mt-6 text-sm text-center opacity-60"
        style={{ color: cardTextColor }}
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
  
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stampedState, setStampedState] = useState<Record<string, number[]>>({});
  
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`habits_${user.uid}`, JSON.stringify(newHabits));
    }
  }, [user]);

  const handleDeleteHabit = useCallback((habitId: string, fromUrl = false) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    updateHabits(updatedHabits);
    
    setStampedState(s => {
      const newS = {...s};
      delete newS[habitId];
      return newS;
    });
    if (typeof window !== 'undefined' && user) {
      localStorage.removeItem(`stamps_${user.uid}_${habitId}`);
    }

    if (expandedHabitId === habitId) {
      handleExpandToggle(habitId);
    }
    
    if(!fromUrl) {
        router.push(`/home?delete=${habitId}`, {scroll: false});
    }
  }, [habits, updateHabits, expandedHabitId, router, user]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedHabits = localStorage.getItem(`habits_${user.uid}`);
      if (savedHabits) {
        try {
          const parsedHabits = JSON.parse(savedHabits);
          if (Array.isArray(parsedHabits)) {
            setHabits(parsedHabits);
            const newStampedState: Record<string, number[]> = {};
            parsedHabits.forEach((habit: Habit) => {
              const savedStamps = localStorage.getItem(`stamps_${user.uid}_${habit.id}`);
              newStampedState[habit.id] = savedStamps ? JSON.parse(savedStamps) : [];
            });
            setStampedState(newStampedState);
          }
        } catch (e) {
          console.error("Failed to parse habits from localStorage", e);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (newHabitParam && user) {
      try {
        const newHabit = JSON.parse(decodeURIComponent(newHabitParam));
        setHabits(prevHabits => {
            const existingHabitIndex = prevHabits.findIndex(h => h.id.split('-')[0] === newHabit.id.split('-')[0]);
            let updatedHabits;
            if (existingHabitIndex !== -1) {
                updatedHabits = [...prevHabits];
                const oldHabit = updatedHabits[existingHabitIndex];
                if (oldHabit.id !== newHabit.id) {
                   if (typeof window !== 'undefined') {
                      localStorage.removeItem(`stamps_${user.uid}_${oldHabit.id}`);
                   }
                   setStampedState(s => ({...s, [oldHabit.id]: [], [newHabit.id]: []}));
                }
                updatedHabits[existingHabitIndex] = newHabit;
            } else {
                updatedHabits = [...prevHabits, newHabit];
                setStampedState(s => ({...s, [newHabit.id]: []}));
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem(`habits_${user.uid}`, JSON.stringify(updatedHabits));
            }
            return updatedHabits;
        });
        router.replace('/home', {scroll: false});
      } catch (error) {
        console.error("Failed to process habit from URL", error);
      }
    }
  }, [newHabitParam, router, user]);
  
  useEffect(() => {
    if(habitToDeleteParam) {
      handleDeleteHabit(habitToDeleteParam, true);
      router.replace('/home', {scroll: false});
    }
  }, [habitToDeleteParam, router, handleDeleteHabit]);


  const handleEditHabit = (habit: Habit) => {
    const details = encodeURIComponent(JSON.stringify(habit));
    router.push(`/new?habit=${details}`);
  };

  const handleExpandToggle = (habitId: string) => {
    if (expandedHabitId === habitId) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setExpandedHabitId(null);
        setIsAnimatingOut(false);
      }, 300); 
    } else {
      setExpandedHabitId(habitId);
    }
  };
  
  const toggleStampForHabit = (habitId: string, day: number) => {
    if (!user) return;
    setStampedState(prevState => {
      const currentStamps = prevState[habitId] || [];
      const newStamps = currentStamps.includes(day)
        ? currentStamps.filter(d => d !== day)
        : [...currentStamps, day];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(`stamps_${user.uid}_${habitId}`, JSON.stringify(newStamps));
      }
      
      return {
        ...prevState,
        [habitId]: newStamps,
      };
    });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/signin');
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-white">Loading...</p>
        </div>
    );
  }

  const expandedHabit = habits.find(h => h.id === expandedHabitId);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
        
        <div 
            className={cn(
                "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                (expandedHabitId && !isAnimatingOut) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => expandedHabitId && handleExpandToggle(expandedHabitId)}
        />
        
        {expandedHabit && (
          <div
            className={cn(
              "fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300",
              isAnimatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
            onClick={() => handleExpandToggle(expandedHabit.id)}
          >
            <div
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <StampCard
                habit={expandedHabit}
                stamped={stampedState[expandedHabit.id] || []}
                toggleStamp={(day) => toggleStampForHabit(expandedHabit.id, day)}
                onDelete={handleDeleteHabit}
                onEdit={handleEditHabit}
                isExpanded={true}
                onExpand={() => handleExpandToggle(expandedHabit.id)}
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
            <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
                <div className="relative">
                  <h1 className="font-playfair text-4xl">Stamps</h1>
                   <div className="font-caveat absolute top-10 left-12 text-pink-900 bg-pink-300 px-2 rounded -rotate-12">
                    @{user.displayName || user.email?.split('@')[0]}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        className="rounded-full bg-white text-black"
                        asChild
                    >
                        <Link href="/new">
                            <Plus />
                        </Link>
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        onClick={handleSignOut}
                    >
                        <LogOut />
                    </Button>
                </div>
            </header>

            <main className="p-4 mt-24 flex-1 flex items-center">
                {habits.length > 0 ? (
                    <Carousel 
                        setApi={setApi}
                        opts={{ align: "center", loop: false }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {habits.map((habit, index) => (
                                <CarouselItem 
                                    key={habit.id} 
                                    className={cn(
                                        "pl-4 transition-opacity duration-300",
                                        "basis-5/6",
                                        (expandedHabitId === habit.id && !isAnimatingOut) ? 'opacity-0' : 'opacity-100'
                                    )}
                                >
                                    <div className={cn(
                                        "transition-all duration-300",
                                        index !== current ? 'scale-90 opacity-70' : 'scale-100 opacity-100',
                                    )}>
                                        <StampCard
                                            habit={habit}
                                            stamped={stampedState[habit.id] || []}
                                            toggleStamp={(day) => toggleStampForHabit(habit.id, day)}
                                            onDelete={handleDeleteHabit}
                                            onEdit={handleEditHabit}
                                            isExpanded={false}
                                            onExpand={() => handleExpandToggle(habit.id)}
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
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <HomePageContent />
    </Suspense>
  );
}

    