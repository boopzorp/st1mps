
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
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
import { StampIcon, stampIconNames, StampIconName } from "@/components/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInCalendarDays } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

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
            endDate: decodedHabit.endDate ? new Date(decodedHabit.endDate) : undefined,
            condition: decodedHabit.description,
            themeColor: decodedHabit.textColor,
            bgColor: decodedHabit.cardClass,
            stampLogo: decodedHabit.stampLogo,
            createdAt: decodedHabit.createdAt ? new Date(decodedHabit.createdAt) : new Date()
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
      endDate: undefined as Date | undefined,
      condition: "",
      themeColor: "#3B6EC5",
      bgColor: "bg-[#F3F0E6]",
      stampLogo: 'star' as StampIconName,
      createdAt: new Date(),
    };
  });

  const [matchDays, setMatchDays] = useState(false);

  const timePeriodDays = formData.endDate ? differenceInCalendarDays(formData.endDate, formData.createdAt) + 1 : 0;

  useEffect(() => {
    if (matchDays && formData.endDate) {
      const days = differenceInCalendarDays(formData.endDate, formData.createdAt) + 1;
      if (days > 0) {
        setFormData(prev => ({ ...prev, numStamps: days }));
      }
    }
  }, [formData.endDate, matchDays, formData.createdAt]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === 'numStamps') {
      setMatchDays(false);
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({...prev, endDate: date}));
  }

  const handleLogoChange = (value: StampIconName) => {
    setFormData((prev) => ({ ...prev, stampLogo: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const habitId = (formData.titleLine2 || "habit").toLowerCase().replace(/ /g, "-") + '-' + Date.now();
    
    let subtitle = "0 days";
    if (formData.endDate) {
        const days = differenceInCalendarDays(formData.endDate, formData.createdAt) + 1;
        subtitle = `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    const newHabit = {
      id: habitId,
      titleLine1: formData.titleLine1,
      titleLine2: formData.titleLine2,
      line1Font: formData.line1Font,
      line2Font: formData.line2Font,
      subtitle: subtitle,
      description: formData.condition,
      cardClass: formData.bgColor,
      titleClass: "",
      numStamps: Number(formData.numStamps),
      textColor: formData.themeColor,
      stampLogo: formData.stampLogo,
      createdAt: formData.createdAt.toISOString(),
      endDate: formData.endDate?.toISOString(),
    };

    const details = encodeURIComponent(JSON.stringify(newHabit))
    router.push(`/?habit=${details}`);
  };

  

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
        <h1 className="font-playfair text-4xl mb-4">New Stamp</h1>
        
        {/* Preview */}
        <div className="mb-8">
            <Label className="text-lg mb-2 block font-medium text-gray-400">Preview</Label>
            <div
              className={`rounded-lg p-6 ${formData.bgColor} shadow-lg`}
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
              >{`${timePeriodDays > 0 ? timePeriodDays : 0} day${timePeriodDays !== 1 ? 's' : ''}`}</p>
              <div className="mt-6 grid grid-cols-5 gap-3">
                {Array.from({ length: Math.min(Number(formData.numStamps) || 0, 10) }).map(
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
                 {(Number(formData.numStamps) || 0) > 10 && (
                  <div className="aspect-square rounded-full flex items-center justify-center">
                    <span style={{ color: formData.themeColor, opacity: 0.6 }}>...</span>
                  </div>
                )}
              </div>
              <p
                className="mt-6 text-sm text-center opacity-60"
                style={{ color: formData.themeColor }}
              >
                {formData.condition || "Your condition here"}
              </p>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-6">
            <div className="p-4 bg-zinc-900 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Reward Text</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="titleLine1">Line 1</Label>
                  <Input id="titleLine1" value={formData.titleLine1} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
                </div>
                <div>
                  <Label htmlFor="line1Font">Line 1 Font</Label>
                  <Select onValueChange={(v) => handleSelectChange("line1Font", v)} value={formData.line1Font}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className={cn(opt.value)}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="titleLine2">Line 2</Label>
                  <Input id="titleLine2" value={formData.titleLine2} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
                </div>
                <div>
                  <Label htmlFor="line2Font">Line 2 Font</Label>
                  <Select onValueChange={(v) => handleSelectChange("line2Font", v)} value={formData.line2Font}>
                    <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className={cn(opt.value)}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Details</h3>
               <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Textarea id="condition" value={formData.condition} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" placeholder="e.g., Go for a run every day" />
              </div>
            </div>

            <div className="p-4 bg-zinc-900 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Duration & Stamps</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                      <div className="flex items-center justify-between">
                          <Label htmlFor="numStamps">Number of Stamps</Label>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="match-days" checked={matchDays} onCheckedChange={(checked) => setMatchDays(Boolean(checked))} />
                              <label
                                  htmlFor="match-days"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                  Match number of days
                              </label>
                          </div>
                      </div>
                      <Input id="numStamps" type="number" value={formData.numStamps} onChange={handleInputChange} className="mt-1 bg-zinc-800 border-zinc-700" />
                  </div>
                </div>
            </div>

            <div className="p-4 bg-zinc-900 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Appearance</h3>
                 <div className="space-y-4">
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
                                        formData.stampLogo === name ? 'border-white bg-zinc-700' : 'border-zinc-700 bg-zinc-800'
                                    )}
                                >
                                    <RadioGroupItem value={name} id={`logo-${name}`} className="sr-only" />
                                    <StampIcon name={name} className="h-6 w-6" />
                                </Label>
                            ))}
                        </RadioGroup>
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
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-white text-black text-lg font-semibold hover:bg-gray-200 mt-8"
          >
            Create Stamp
          </Button>
        </form>
      </main>
      </div>
    </div>
  );
}

    