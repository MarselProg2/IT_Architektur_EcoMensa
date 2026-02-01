import data from './placeholder-images.json';
import { Meal } from './types';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: Record<string, ImagePlaceholder> = data.placeholderImages.reduce((acc, img) => {
  acc[img.id] = img;
  return acc;
}, {} as Record<string, ImagePlaceholder>);

const KEYWORD_IMAGES: Record<string, string> = {
  // Fast Food / Classics
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  fries: "https://images.unsplash.com/photo-1573080496987-8198896d84aa?auto=format&fit=crop&w=800&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",

  // Döner / Kebab
  doener: "https://images.unsplash.com/photo-1662116763958-b6bcc1a9fa28?auto=format&fit=crop&w=800&q=80", // Kebab plate/box
  kebab: "https://images.unsplash.com/photo-1662116763958-b6bcc1a9fa28?auto=format&fit=crop&w=800&q=80",
  doenerbox: "https://images.unsplash.com/photo-1662116763958-b6bcc1a9fa28?auto=format&fit=crop&w=800&q=80",
  yufka: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",

  // Asian
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
  ramen: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  curry: "https://images.unsplash.com/photo-1631292726056-16784a0c8b6d?auto=format&fit=crop&w=800&q=80",
  rice: "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80",
  asian: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  wok: "https://images.unsplash.com/photo-1599553229769-cf392f2324dc?auto=format&fit=crop&w=800&q=80",

  // Italian / Pasta
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  spaghetti: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  lasagne: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
  tortellini: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",

  // Healthy / Veggie
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  vegan: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  veggie: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=800&q=80",
  bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23acbe3226bf?auto=format&fit=crop&w=800&q=80",

  // Meat
  schnitzel: "https://images.unsplash.com/photo-1599921841143-819065a5a9ac?auto=format&fit=crop&w=800&q=80",
  steak: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
  chicken: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  meat: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  beef: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
  sausage: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80",
  wurst: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80",

  // Fish
  fish: "https://images.unsplash.com/photo-1519708227418-e8d316d8e9d3?auto=format&fit=crop&w=800&q=80",
  salmon: "https://images.unsplash.com/photo-1519708227418-e8d316d8e9d3?auto=format&fit=crop&w=800&q=80",

  // Dessert
  dessert: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  coffee: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
};

export function getMealImage(meal: Meal): string {
  // 1. Check direct override/mapping from JSON
  if (placeholderImages[meal.imageId]) {
    return placeholderImages[meal.imageId].imageUrl;
  }

  // 2. Keyword matching in Name and Description
  const textToScan = `${meal.name} ${meal.description}`.toLowerCase();

  // Normalize german umlauts for simpler matching
  const normalizedText = textToScan
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

  for (const [keyword, url] of Object.entries(KEYWORD_IMAGES)) {
    if (normalizedText.includes(keyword)) {
      return url;
    }
  }

  // 3. Last fallback: Picsum seed based on ID
  return `https://picsum.photos/seed/${meal.id}/600/400`;
}
