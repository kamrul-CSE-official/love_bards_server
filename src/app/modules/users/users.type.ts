import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  cart: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
}
