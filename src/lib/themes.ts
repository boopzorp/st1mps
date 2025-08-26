export type ColorTheme = {
  name: string;
  primary: { h: number; s: number; l: number };
  primaryForeground: { h: number; s: number; l: number };
  ring: { h: number; s: number; l: number };
};

export const colorThemes: ColorTheme[] = [
  {
    name: "navy-purple",
    primary: { h: 234, s: 62, l: 30 },
    primaryForeground: { h: 210, s: 40, l: 98 },
    ring: { h: 234, s: 62, l: 30 },
  },
  {
    name: "forest-teal",
    primary: { h: 158, s: 45, l: 30 },
    primaryForeground: { h: 158, s: 20, l: 95 },
    ring: { h: 158, s: 45, l: 30 },
  },
  {
    name: "ruby-rose",
    primary: { h: 350, s: 70, l: 45 },
    primaryForeground: { h: 350, s: 40, l: 98 },
    ring: { h: 350, s: 70, l: 45 },
  },
  {
    name: "gold-amber",
    primary: { h: 35, s: 80, l: 45 },
    primaryForeground: { h: 35, s: 50, l: 15 },
    ring: { h: 35, s: 80, l: 45 },
  },
  {
    name: 'slate-indigo',
    primary: { h: 221, s: 39, l: 49 },
    primaryForeground: { h: 221, s: 30, l: 95 },
    ring: { h: 221, s: 39, l: 49 },
  },
  {
    name: 'olive-lime',
    primary: { h: 75, s: 39, l: 45 },
    primaryForeground: { h: 75, s: 50, l: 15 },
    ring: { h: 75, s: 39, l: 45 },
  }
];
