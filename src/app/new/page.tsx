
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const fontOptions = [
  { value: "font-sans", label: "Inter (Sans-serif)" },
  { value: "font-playfair", label: "Playfair Display (Serif)" },
  { value: "font-vt323", label: "VT323 (Pixel)" },
];

const colorOptions = [
  { value: "#3B6EC5", label: "Blue" },
  { value: "#000000", label: "Black" },
  { value: "#E53E3E", label: "Red" },
  { value: "#38A169", label: "Green" },
  { value: "#DD6B20", label: "Orange" },
];

const backgroundOptions = [
  { value: "bg-[#F3F0E6]", label: "Off-White" },
  { value: "bg-[#F8D8D8]", label: "Pink" },
  { value: "bg-zinc-800", label: "Dark Grey" },
  { value: "bg-white", label: "White" },
  { value: "bg-[#E6F4EA]", label: "Mint Green" },
];

export default function NewHabitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titleLine1: "GET A NEW",
    line1Font: "font-sans",
    titleLine2: "CAMERA",
    line2Font: "font-vt323",
    numStamps: 12,
    timePeriod: 26,
    condition: "buy a canon g7x if you complete 12 design projects by 7th March",
    themeColor: "#3B6EC5",
    bgColor: "bg-[#F3F0E6]",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit = {
      id: formData.titleLine2.toLowerCase().replace(/ /g, "-"),
      titleLine1: formData.titleLine1,
      titleLine2: formData.titleLine2,
      line1Font: formData.line1Font,
      line2Font: formData.line2Font,
      subtitle: `${formData.timePeriod} days`,
      description: formData.condition,
      cardClass: formData.bgColor,
      titleClass: "",
      numStamps: Number(formData.numStamps),
      textColor: formData.themeColor,
    };

    router.push(`/?habit=${encodeURIComponent(JSON.stringify(newHabit))}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center p-4">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="mb-8">
            <Label className="text-lg mb-2 block">Preview</Label>
            <div
              className={`rounded-lg p-6 ${formData.bgColor}`}
            >
              <h2
                className={`text-4xl font-bold break-words`}
                style={{ color: formData.themeColor }}
              >
                <span className={cn(formData.line1Font)}>
                  {formData.titleLine1 || "LINE 1"}
                </span>
                <br />
                <span className={cn(formData.line2Font)}>
                  {formData.titleLine2 || "LINE 2"}
                </span>
              </h2>
              <p
                className="mt-2 text-sm opacity-60"
                style={{ color: formData.themeColor }}
              >{`${formData.timePeriod || 0} days`}</p>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {Array.from({ length: Number(formData.numStamps) || 0 }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-full border-2 border-dashed flex items-center justify-center"
                      style={{ borderColor: `${formData.themeColor}40` }}
                    >
                      <span
                        className="text-sm opacity-50"
                        style={{ color: formData.themeColor }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  )
                )}
              </div>
              <p
                className="mt-6 text-sm text-center opacity-60"
                style={{ color: formData.themeColor }}
              >
                {formData.condition}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="titleLine1">Reward Line 1</Label>
              <Input id="titleLine1" value={formData.titleLine1} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
            <div>
              <Label htmlFor="line1Font">Reward Line 1 Font</Label>
              <Select onValueChange={(v) => handleSelectChange("line1Font", v)} defaultValue={formData.line1Font}>
                <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="font-sans">Inter</SelectItem><SelectItem value="font-playfair">Playfair</SelectItem><SelectItem value="font-vt323">VT323</SelectItem></SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="titleLine2">Reward Line 2</Label>
              <Input id="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
            <div>
              <Label htmlFor="line2Font">Reward Line 2 Font</Label>
              <Select onValueChange={(v) => handleSelectChange("line2Font", v)} defaultValue={formData.line2Font}>
                <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="font-sans">Inter</SelectItem><SelectItem value="font-playfair">Playfair</SelectItem><SelectItem value="font-vt323">VT323</SelectItem></SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numStamps">Number of Stamps</Label>
              <Input id="numStamps" type="number" value={formData.numStamps} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
             <div>
              <Label htmlFor="timePeriod">Time Period (days)</Label>
              <Input id="timePeriod" type="number" value={formData.timePeriod} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
            <div>
                <Label htmlFor="condition">Condition</Label>
                <Textarea id="condition" value={formData.condition} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
             <div>
                <Label htmlFor="themeColor">Theme Color</Label>
                <Select onValueChange={(v) => handleSelectChange("themeColor", v)} defaultValue={formData.themeColor}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <Select onValueChange={(v) => handleSelectChange("bgColor", v)} defaultValue={formData.bgColor}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {backgroundOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-white text-black text-lg font-semibold hover:bg-gray-200 mt-6"
          >
            Create Stamp
          </Button>
        </form>
      </main>
    </div>
  );
}
