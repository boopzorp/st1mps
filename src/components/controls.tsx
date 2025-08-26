"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { stampIconNames, StampIcon } from "./icons.tsx";
import type { StampIconName } from "./icons.tsx";
import { Separator } from "./ui/separator";
import { colorThemes } from "@/lib/themes";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface Config {
  title: string;
  days: number;
  font: string;
  stamp: string;
  color: string;
}

interface ControlsProps {
  config: Config;
  onConfigChange: (newConfig: Partial<Config>) => void;
}

export function Controls({ config, onConfigChange }: ControlsProps) {
  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-bold tracking-tight">
          StampTracker
        </CardTitle>
        <CardDescription>Customize your habit tracker.</CardDescription>
      </CardHeader>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => onConfigChange({ title: e.target.value })}
            placeholder="e.g., Read a book every day"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="font">Font</Label>
          <Select
            value={config.font}
            onValueChange={(value) => onConfigChange({ font: value })}
          >
            <SelectTrigger id="font">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="playfair-display">Playfair Display</SelectItem>
              <SelectItem value="roboto-slab">Roboto Slab</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Color Theme</Label>
          <TooltipProvider>
            <RadioGroup
              value={config.color}
              onValueChange={(value) => onConfigChange({ color: value })}
              className="grid grid-cols-6 gap-2 pt-1"
            >
              {colorThemes.map((theme) => (
                <Tooltip key={theme.name}>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor={`color-${theme.name}`}
                      className="cursor-pointer rounded-full border-2 border-transparent p-0.5 flex items-center justify-center transition-all hover:scale-110 focus-within:scale-110 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:scale-110"
                    >
                      <RadioGroupItem
                        value={theme.name}
                        id={`color-${theme.name}`}
                        className="sr-only"
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: `hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l}%)`,
                        }}
                      />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {theme.name
                        .replace("-", " & ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </RadioGroup>
          </TooltipProvider>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="days">Days</Label>
          <span className="text-sm text-muted-foreground">{config.days}</span>
        </div>
        <Slider
          id="days"
          min={1}
          max={100}
          step={1}
          value={[config.days]}
          onValueChange={(value) => onConfigChange({ days: value[0] })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Stamp Icon</Label>
        <RadioGroup
          value={config.stamp}
          onValueChange={(value) => onConfigChange({ stamp: value })}
          className="grid grid-cols-6 gap-2"
        >
          {stampIconNames.map((name) => (
            <Label
              key={name}
              htmlFor={`stamp-${name}`}
              className="cursor-pointer rounded-md border-2 border-muted bg-popover p-2 flex items-center justify-center hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem
                value={name}
                id={`stamp-${name}`}
                className="sr-only"
              />
              <StampIcon name={name as StampIconName} className="h-6 w-6" />
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
