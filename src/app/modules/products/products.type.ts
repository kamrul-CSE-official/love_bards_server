import mongoose, { Document } from 'mongoose';

// Enum values for category and brand
export const categories = ['decorative', 'sports', 'leaf_cups'] as const;
export const brands = ['Brand A', 'Brand B', 'Brand C'] as const;

export interface IProduct extends Document {
  name: string;
  description: string;
  category: (typeof categories)[number];
  brand: (typeof brands)[number];
  price: number;
  quantity: number;
  images: string[];
  reviews: mongoose.Types.ObjectId[];
  rating: number;
  comments: mongoose.Types.ObjectId[];
}
