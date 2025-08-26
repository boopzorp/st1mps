import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stamp, type StampProps } from "./stamp";
import { cn } from "@/lib/utils";

interface StampTrackerProps {
  title: string;
  days: number;
  fontClass: string;
  stamp: StampProps["stamp"];
}

export function StampTracker({
  title,
  days,
  fontClass,
  stamp,
}: StampTrackerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={cn("text-3xl md:text-4xl", fontClass)}>
          {title}
        </CardTitle>
        <CardDescription className="text-lg">for {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
          {Array.from({ length: days }).map((_, i) => (
            <Stamp key={i} day={i + 1} stamp={stamp} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
