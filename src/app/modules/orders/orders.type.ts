import mongoose, { Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Date;
}
