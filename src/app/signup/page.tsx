
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StampCard } from '@/components/landing/stamp-card';
import { Star, Check } from 'lucide-react';


export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-900 text-white overflow-hidden">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

       <div className="container relative z-10 flex min-h-screen items-center justify-center py-12">
        <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-x-16">
          <div className="relative md:flex items-center justify-center hidden">
             <div className="relative w-full h-full">
                <StampCard
                    title="PRACTICE GUITAR"
                    subtitle="100 hours of practice"
                    icon={Star}
                    stamps={8}
                    font="font-caveat"
                    bgColor="bg-amber-300"
                    textColor="text-amber-950"
                    className="absolute top-[10%] left-0 w-64 h-80 rotate-[-15deg]"
                />
                <StampCard
                    title="DRINK WATER"
                    subtitle="8 glasses a day"
                    icon={Check}
                    stamps={4}
                    font="font-sans"
                    bgColor="bg-sky-300"
                    textColor="text-sky-950"
                    className="absolute bottom-[10%] right-0 w-64 h-80 rotate-[10deg]"
                />
             </div>
          </div>
          
          <div className="w-full max-w-md mx-auto relative">
             <div className="md:hidden absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                      <StampCard
                          title="PRACTICE GUITAR"
                          subtitle="100 hours of practice"
                          icon={Star}
                          stamps={8}
                          font="font-caveat"
                          bgColor="bg-amber-300"
                          textColor="text-amber-950"
                          className="absolute top-[-20%] left-[-30%] w-64 h-80 rotate-[-15deg] scale-90"
                      />
                      <StampCard
                          title="DRINK WATER"
                          subtitle="8 glasses a day"
                          icon={Check}
                          stamps={4}
                          font="font-sans"
                          bgColor="bg-sky-300"
                          textColor="text-sky-950"
                          className="absolute bottom-[-25%] right-[-20%] w-64 h-80 rotate-[10deg]"
                      />
                  </div>
              </div>
             <div className="relative z-10 space-y-8 rounded-lg bg-zinc-900 p-8 sm:p-10 shadow-2xl backdrop-blur-sm md:bg-zinc-900/50">
                  <div className="text-center">
                  <h1 className="font-playfair text-4xl font-bold">Create Your Account</h1>
                  <p className="mt-2 text-gray-400">Start your reward journey today.</p>
                  </div>
                  <form className="space-y-6">
                  <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="mt-1 block w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                  </div>
                  <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-1 block w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                  </div>
                  <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="mt-1 block w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                  </div>
                  <div>
                      <Button
                      type="submit"
                      className="w-full rounded-full bg-indigo-500 py-3 text-lg font-semibold text-white hover:bg-indigo-400"
                      >
                      Sign Up
                      </Button>
                  </div>
                  </form>
                  <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300">
                      Sign In
                  </Link>
                  </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
