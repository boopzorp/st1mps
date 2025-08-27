
import Link from "next/link";
import { Star, Heart, Check, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StampCard } from "@/components/landing/stamp-card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <div className="relative isolate flex-1">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
          <h1 className="font-playfair text-3xl font-bold">Stamps</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button className="bg-white text-black rounded-full hover:bg-gray-200" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </header>

        <main className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 sm:pt-48 lg:pt-56">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-anton">
                Your Goals, Your Rewards.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                Set a goal, create a beautiful stamp card for it, and decide on the reward you'll get for completing it. Turn your ambitions into achievements, one stamp at a time.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  size="lg"
                  className="rounded-full bg-indigo-500 hover:bg-indigo-400 text-lg"
                  asChild
                >
                  <Link href="/home">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mt-16 sm:mt-24 pb-20">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
              <div className="relative h-[80rem] sm:h-[55rem] overflow-hidden">
                <div className="absolute top-0 grid h-full w-full grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col gap-6">
                    <StampCard
                        title="READ EVERY DAY"
                        subtitle="Finish 10 books"
                        icon={Book}
                        stamps={7}
                        font="font-anton"
                        bgColor="bg-rose-300"
                        textColor="text-rose-950"
                        className="rotate-[-3deg]"
                    />
                     <StampCard
                        title="MORNING RUNS"
                        subtitle="30 days of cardio"
                        icon={Heart}
                        stamps={10}
                        font="font-vt323"
                        bgColor="bg-teal-300"
                        textColor="text-teal-950"
                        className="rotate-[2deg]"
                    />
                      <StampCard
                        title="NO SODA"
                        subtitle="30 day challenge"
                        icon={Check}
                        stamps={6}
                        font="font-playfair"
                        bgColor="bg-slate-300"
                        textColor="text-slate-950"
                        className="rotate-[-1deg]"
                    />
                  </div>
                   <div className="flex flex-col gap-6 sm:mt-16">
                     <StampCard
                        title="DRINK WATER"
                        subtitle="8 glasses a day"
                        icon={Check}
                        stamps={4}
                        font="font-sans"
                        bgColor="bg-sky-300"
                        textColor="text-sky-950"
                        className="rotate-[1deg]"
                    />
                    <StampCard
                        title="PRACTICE GUITAR"
                        subtitle="100 hours of practice"
                        icon={Star}
                        stamps={8}
                        font="font-caveat"
                        bgColor="bg-amber-300"
                        textColor="text-amber-950"
                        className="rotate-[-4deg]"
                    />
                    <StampCard
                        title="CODE SOMETHING"
                        subtitle="Daily coding challenge"
                        icon={Star}
                        stamps={9}
                        font="font-source-code-pro"
                        bgColor="bg-indigo-300"
                        textColor="text-indigo-950"
                        className="rotate-[4deg]"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Stamps. Made with ❤️.</p>
      </footer>
    </div>
  );
}
