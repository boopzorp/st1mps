import type { Metadata } from "next";
import { Inter, Playfair_Display, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const fontInter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const fontRobotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "StampTracker",
  description: "Create your own habit tracker.",
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
          fontRobotoSlab.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
