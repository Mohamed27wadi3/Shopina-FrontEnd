export type ColorPalette = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  category: string;
};

export const colorPresets: ColorPalette[] = [
  // Fashion & Luxury
  { id: "luxury-black", name: "Luxe Noir", primary: "#0A1A2F", accent: "#D4AF37", category: "Mode" },
  { id: "luxury-rose", name: "Rose Poudré", primary: "#2D1B3D", accent: "#E8B4C8", category: "Mode" },
  { id: "luxury-navy", name: "Navy Classique", primary: "#001F3F", accent: "#FFFFFF", category: "Mode" },

  // Tech & Modern
  { id: "tech-neon", name: "Néon Futur", primary: "#0A0E27", accent: "#00FF88", category: "High-tech" },
  { id: "tech-blue", name: "Bleu Tech", primary: "#0077FF", accent: "#5AC8FA", category: "High-tech" },
  { id: "tech-purple", name: "Gradient Violet", primary: "#1A0933", accent: "#9945FF", category: "High-tech" },

  // Beauty & Wellness
  { id: "beauty-spa", name: "Spa Sensoriel", primary: "#2F5233", accent: "#D4C5B9", category: "Beauté" },
  { id: "beauty-rose", name: "Rose Doré", primary: "#8B5A5A", accent: "#F4E4D7", category: "Beauté" },
  { id: "beauty-lavender", name: "Lavande", primary: "#4A3F83", accent: "#E8DFF5", category: "Beauté" },

  // Food & Dining
  { id: "food-warm", name: "Chaleur Gourmande", primary: "#6B4423", accent: "#D4896B", category: "Alimentation" },
  { id: "food-fresh", name: "Frais Vert", primary: "#1D4620", accent: "#7CB342", category: "Alimentation" },
  { id: "food-spicy", name: "Épicé Rouge", primary: "#4A1F1F", accent: "#E53935", category: "Alimentation" },

  // Sport & Energy
  { id: "sport-energy", name: "Énergie Électrique", primary: "#0D1B2A", accent: "#FF6B35", category: "Sport" },
  { id: "sport-mono", name: "Noir Athlétique", primary: "#1A1A1A", accent: "#FFFFFF", category: "Sport" },
  { id: "sport-ocean", name: "Océan Bleu", primary: "#0A3D62", accent: "#3A9FD8", category: "Sport" },

  // Lifestyle & Home
  { id: "home-minimal", name: "Minimaliste Zen", primary: "#F5F5F5", accent: "#2A2A2A", category: "Déco" },
  { id: "home-earth", name: "Terre Naturelle", primary: "#8B7355", accent: "#D2B48C", category: "Déco" },
  { id: "home-coastal", name: "Côtier Bohème", primary: "#2C5F7C", accent: "#E8D5C4", category: "Déco" },

  // Neutral & Universal
  { id: "universal-gray", name: "Gris Intemporel", primary: "#4A4A4A", accent: "#00A8E8", category: "Tous" },
  { id: "universal-cream", name: "Crème Ivoire", primary: "#3E3E3E", accent: "#C9B8A3", category: "Tous" },
  { id: "universal-midnight", name: "Minuit Élégant", primary: "#1A1A2E", accent: "#FF006E", category: "Tous" },
];

export function getPalettesByCategory(category: string): ColorPalette[] {
  if (category === "Tous") return colorPresets;
  return colorPresets.filter((p) => p.category === category);
}

export function getPaletteById(id: string): ColorPalette | undefined {
  return colorPresets.find((p) => p.id === id);
}
