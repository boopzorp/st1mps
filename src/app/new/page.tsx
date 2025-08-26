
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NewHabitPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      router.push(`/?title=${encodeURIComponent(title)}`);
    }
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
          <span className="ml-2">Cancel</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col p-4">
        <h1 className="font-playfair text-4xl mb-8">New Stamp</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read a book"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-white text-black text-lg font-semibold hover:bg-gray-200"
            disabled={!title}
          >
            Create
          </Button>
        </form>
      </main>
    </div>
  );
}
