import mongoose, { Document } from 'mongoose';


// Enum values for category and brand
export const categories = ['Kitchen', 'Home Decor', 'Stationery', 'Jewelry'] as const;
export const brands = [
  'CraftyHands',
  'WeaveWonders',
  'ArtisanClay',
  'LeatherCraft',
  'NatureJewels'
] as const;

export interface IProduct extends Document {
  name: string;
  description: string;
  category: (typeof categories)[number];
  brand: (typeof brands)[number];
  price: number;
  quantity: number;
  images: string[];
  reviews: mongoose.Types.ObjectId[];
  visitors: number;
  incrementVisitors(): Promise<void>;
}
