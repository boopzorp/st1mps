"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StampIcon } from "@/components/icons";

export default function HabitPage({ params }: { params: { id: string } }) {
  const [stamped, setStamped] = useState<number[]>([1, 2]);

  const toggleStamp = (day: number) => {
    setStamped((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
        >
          Edit
        </Button>
      </header>
      <main className="flex-1 flex flex-col justify-between p-4">
        <div className="bg-[#F3F0E6] rounded-lg p-6 text-black">
          <h2 className="text-5xl font-bold font-vt323 text-[#3B6EC5]">
            GET A NEW CAMERA
          </h2>
          <p className="mt-2 text-sm opacity-60">26 days | 19:10:59</p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => {
              const day = i + 1;
              const isStamped = stamped.includes(day);
              return (
                <button
                  key={i}
                  onClick={() => toggleStamp(day)}
                  className={cn(
                    "aspect-square rounded-full flex items-center justify-center border-2 border-dashed",
                    isStamped
                      ? "bg-[#3B6EC5] border-transparent"
                      : "border-black/20"
                  )}
                >
                  {isStamped ? (
                    <StampIcon name="camera" className="text-white h-6 w-6" />
                  ) : (
                    <span className="text-sm opacity-50">{day}</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-center opacity-60">
            buy a canon g7x if you complete 12 design projects by 7th March
          </p>
        </div>

        <div className="py-4">
          <Button className="w-full h-14 rounded-full bg-[#F3F0E6] text-black text-2xl font-playfair hover:bg-gray-200">
            Stamp
          </Button>
        </div>
      </main>
    </div>
  );
}
