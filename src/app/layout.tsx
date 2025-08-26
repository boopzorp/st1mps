import type { Metadata } from "next";
import { Inter, Playfair_Display, VT323, Source_Code_Pro, Caveat, Anton } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const fontInter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: "400",
});

const fontVT323 = VT323({
  subsets: ["latin"],
  variable: "--font-vt323",
  weight: "400",
});

const fontSourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  weight: "400",
});

const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: "400",
});

const fontAnton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Stamps",
  description: "A habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable,
          fontPlayfair.variable,
          fontVT323.variable,
          fontSourceCodePro.variable,
          fontCaveat.variable,
          fontAnton.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
