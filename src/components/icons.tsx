import {
  Check,
  Star,
  Heart,
  Smile,
  ThumbsUp,
  Award,
  Camera,
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
};

export type StampIconName = keyof typeof stampIcons;

export const stampIconNames = Object.keys(stampIcons) as StampIconName[];

export const StampIcon = ({
  name,
  ...props
}: { name: StampIconName } & LucideProps) => {
  const IconComponent = stampIcons[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
