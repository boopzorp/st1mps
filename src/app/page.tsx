
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function StampCard({
  href,
  title,
  subtitle,
  description,
  cardClass,
  titleClass,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  cardClass: string;
  titleClass: string;
}) {
  return (
    <Link href={href} className="block">
      <div className={`rounded-lg p-6 text-black ${cardClass}`}>
        <h2 className={`text-5xl font-bold ${titleClass}`}>{title}</h2>
        <p className="mt-2 text-sm opacity-60">{subtitle}</p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-full border-2 border-dashed border-black/20 flex items-center justify-center"
            >
              <span className="text-sm opacity-50">{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-center opacity-60">{description}</p>
      </div>
    </Link>
  );
}

function HomePageContent() {
  const params = useSearchParams();
  const newHabitTitle = params.get("title");

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
        {newHabitTitle && (
          <StampCard
            href={`/habit/${newHabitTitle.toLowerCase().replace(/ /g, "-")}`}
            title={newHabitTitle}
            subtitle="0 days"
            description=""
            cardClass="bg-zinc-800"
            titleClass="font-sans text-white"
          />
        )}
        <StampCard
          href="/habit/camera"
          title="GET A NEW CAMERA"
          subtitle="26 days | 19:10:59"
          description="buy a canon g7x if you complete 12 design projects by 7th March"
          cardClass="bg-[#F3F0E6]"
          titleClass="font-vt323 text-[#3B6EC5]"
        />
        <StampCard
          href="/habit/travel"
          title="Travel To HONG KONG"
          subtitle="2m 20d | 19:10:59"
          description=""
          cardClass="bg-[#F8D8D8]"
          titleClass="font-playfair text-black"
        />
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
