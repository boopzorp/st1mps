
import {
  Check,
  Star,
  Heart,
  Smile,
  ThumbsUp,
  Award,
  Camera,
  Plane,
  Book,
  PenTool,
  Code,
  type LucideProps,
} from "lucide-react";

export const stampIcons = {
  check: Check,
  star: Star,
  heart: Heart,
  smile: Smile,
  "thumbs-up": ThumbsUp,
  award: Award,
  camera: Camera,
  plane: Plane,
  book: Book,
  "pen-tool": PenTool,
  code: Code,
};

export type StampIconName = keyof typeof stampIcons;

// Filter out 'check' for user selection, it's used internally.
export const stampIconNames = Object.keys(stampIcons).filter(name => name !== 'check') as StampIconName[];

export const StampIcon = ({
  name,
  ...props
}: { name: StampIconName } & LucideProps) => {
  const IconComponent = stampIcons[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
