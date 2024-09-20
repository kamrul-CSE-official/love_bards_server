import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from './users.type';

// Define the schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, 
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  // Hash the password with bcrypt
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    next();
  } catch (error:any) {
    return next(error);
  }
});

// Instance method to compare passwords (can be used in services)
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const user = this as IUser;
  return await bcrypt.compare(enteredPassword, user.password);
};

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
