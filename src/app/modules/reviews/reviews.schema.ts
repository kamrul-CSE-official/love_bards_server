import mongoose, { Schema } from 'mongoose';
import { IReview } from './reviews.type';

const reviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 1 },
  comment: { type: String, required: true }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
