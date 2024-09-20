import mongoose, { Schema } from 'mongoose';
import { IUser } from './users.type';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
