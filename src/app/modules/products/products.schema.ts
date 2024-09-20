import mongoose, { Schema, Document } from 'mongoose';
import { brands, categories, IProduct } from './products.type';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: categories, required: true },
  brand: { type: String, enum: brands, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [{ type: String, required: true }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  rating: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
