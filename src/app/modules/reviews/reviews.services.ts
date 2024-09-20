import Review from './reviews.schema';
import { IReview } from './reviews.type';

class ReviewService {
  // Create a new review
  async createReview(reviewData: IReview): Promise<IReview> {
    const newReview = new Review(reviewData);
    await newReview.save();
    return newReview;
  }

  // Get reviews for a product with pagination
  async getProductReviews(productId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ product: productId });
    const reviews = await Review.find({ product: productId })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('product');

    return { reviews, total };
  }

  // Update a review by ID
  async updateReview(reviewId: string, reviewData: Partial<IReview>): Promise<IReview | null> {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });
    return updatedReview;
  }

  // Delete a review by ID
  async deleteReview(reviewId: string): Promise<IReview | null> {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    return deletedReview;
  }
}

export default new ReviewService();
