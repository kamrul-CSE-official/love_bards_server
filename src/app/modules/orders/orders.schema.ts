import mongoose, { Schema } from 'mongoose';
import { IOrder } from './orders.type';

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
