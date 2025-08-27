
import { cn } from "@/lib/utils";

export const StampCard = ({
  className,
  title,
  subtitle,
  icon: Icon,
  stamps,
  font,
  bgColor,
  textColor,
}: {
  className?: string;
  title: string;
  subtitle:string;
  icon: React.ElementType;
  stamps: number;
  font: string;
  bgColor: string;
  textColor: string;
}) => (
  <div
    className={cn(
      "rounded-lg p-6 shadow-lg flex flex-col justify-between w-full h-full",
      bgColor,
      className
    )}
    style={{ color: textColor }}
  >
    <div>
      <h3 className={cn("text-3xl font-bold break-words", font)}>{title}</h3>
      <p className="mt-1 text-sm opacity-70">{subtitle}</p>
      <div className="mt-6 grid grid-cols-5 gap-3">
        {Array.from({ length: stamps }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-full bg-black/10 flex items-center justify-center"
          >
            <Icon className="h-5 w-5 opacity-70" />
          </div>
        ))}
        {Array.from({ length: 10 - stamps }).map((_, i) => (
          <div
            key={i + stamps}
            className="aspect-square rounded-full border-2 border-dashed border-black/20"
          ></div>
        ))}
      </div>
    </div>
    <p className="mt-4 text-sm text-center opacity-60">
      A little progress each day adds up to big results.
    </p>
  </div>
);
