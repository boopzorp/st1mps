
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Sparkles } from "lucide-react";
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
import { extractHabitDetails } from "@/ai/flows/extract-habit-details";
import { useToast } from "@/hooks/use-toast";
import { StampIcon, stampIconNames, StampIconName } from "@/components/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const fontOptions = [
  { value: "font-sans", label: "Inter (Sans-serif)" },
  { value: "font-playfair", label: "Playfair Display (Serif)" },
  { value: "font-playfair italic", label: "Playfair Display (Cursive)" },
  { value: "font-vt323", label: "VT323 (Pixel)" },
  { value: "font-source-code-pro", label: "Source Code Pro (Mono)" },
  { value: "font-caveat", label: "Caveat (Handwritten)" },
  { value: "font-anton", label: "Anton (Display)" },
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
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const habitParam = searchParams.get('habit');
    if (habitParam) {
      try {
        const decodedHabit = JSON.parse(decodeURIComponent(habitParam));
        // A simple check to ensure it's a habit object
        if(decodedHabit.id) {
           return {
            titleLine1: decodedHabit.titleLine1,
            line1Font: decodedHabit.line1Font,
            titleLine2: decodedHabit.titleLine2,
            line2Font: decodedHabit.line2Font,
            numStamps: decodedHabit.numStamps,
            timePeriod: decodedHabit.subtitle.split(' ')[0],
            condition: decodedHabit.description,
            themeColor: decodedHabit.textColor,
            bgColor: decodedHabit.cardClass,
            stampLogo: decodedHabit.stampLogo,
          };
        }
      } catch (e) {
        console.error("Failed to parse habit from URL", e);
      }
    }
    return {
      titleLine1: "",
      line1Font: "font-sans",
      titleLine2: "",
      line2Font: "font-sans",
      numStamps: 0,
      timePeriod: 0,
      condition: "",
      themeColor: "#3B6EC5",
      bgColor: "bg-[#F3F0E6]",
      stampLogo: 'star' as StampIconName,
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = (value: StampIconName) => {
    setFormData((prev) => ({ ...prev, stampLogo: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const habitId = (formData.titleLine2 || "habit").toLowerCase().replace(/ /g, "-") + '-' + Date.now();
    const newHabit = {
      id: habitId,
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
      stampLogo: formData.stampLogo,
    };

    const details = encodeURIComponent(JSON.stringify(newHabit))
    router.push(`/?habit=${details}`);
  };

  const handleAutoFill = async () => {
    if (!formData.condition) {
        toast({
            title: "Condition is empty",
            description: "Please enter a condition to auto-fill details.",
            variant: 'destructive',
        })
        return;
    }
    setIsExtracting(true);
    try {
        const result = await extractHabitDetails(formData.condition);
        setFormData(prev => ({
            ...prev,
            numStamps: result.numStamps,
            timePeriod: result.timePeriodDays
        }));
         toast({
            title: "Details extracted!",
            description: "Number of stamps and time period have been updated.",
        })
    } catch(e) {
        console.error(e);
        toast({
            title: "Extraction failed",
            description: "Could not extract details from the condition. Please enter them manually.",
            variant: 'destructive',
        })
    } finally {
        setIsExtracting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
    <div className="max-w-md mx-auto w-full">
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
              <Select onValueChange={(v) => handleSelectChange("line1Font", v)} value={formData.line1Font}>
                <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className={cn(opt.value)}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="titleLine2">Reward Line 2</Label>
              <Input id="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
            </div>
            <div>
              <Label htmlFor="line2Font">Reward Line 2 Font</Label>
              <Select onValueChange={(v) => handleSelectChange("line2Font", v)} value={formData.line2Font}>
                <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className={cn(opt.value)}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
                <Label htmlFor="stampLogo">Stamp Logo</Label>
                <RadioGroup
                    value={formData.stampLogo}
                    onValueChange={(v) => handleLogoChange(v as StampIconName)}
                    className="grid grid-cols-6 gap-2 mt-2"
                >
                    {stampIconNames.map((name) => (
                        <Label
                            key={name}
                            htmlFor={`logo-${name}`}
                            className={cn("p-3 rounded-md flex items-center justify-center cursor-pointer border-2",
                                formData.stampLogo === name ? 'border-white' : 'border-zinc-700'
                            )}
                        >
                            <RadioGroupItem value={name} id={`logo-${name}`} className="sr-only" />
                            <StampIcon name={name} className="h-6 w-6" />
                        </Label>
                    ))}
                </RadioGroup>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <Label htmlFor="condition">Condition</Label>
                    <Button variant="ghost" size="sm" type="button" onClick={handleAutoFill} disabled={isExtracting}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isExtracting ? 'Extracting...' : 'Auto-fill'}
                    </Button>
                </div>
                <Textarea id="condition" value={formData.condition} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
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
                <Label htmlFor="themeColor">Theme Color</Label>
                <Select onValueChange={(v) => handleSelectChange("themeColor", v)} value={formData.themeColor}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {colorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <Select onValueChange={(v) => handleSelectChange("bgColor", v)} value={formData.bgColor}>
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
    </div>
  );
}
