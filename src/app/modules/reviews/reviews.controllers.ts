import { Request, Response } from 'express';
import reviewsServices from './reviews.services';
import sendResponse from '../../../shared/response';
import reviewHelper from './reviews.helper';

class ReviewController {
  // Create a new review
  async createReview(req: Request, res: Response) {
    try {
      const reviewData = req.body;
      const userId = req.body.user as string;
      const productId = reviewData.product;

      // Check if the user has ordered the product
      const hasPurchased = await reviewHelper.checkUserOrder(userId, productId);
      console.log("Has Purchased: ",hasPurchased)

      if (!hasPurchased) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: 'You can only review products you have purchased.',
          data: null
        });
      }

      // Create the review if the user has purchased the product
      const newReview = await reviewsServices.createReview(reviewData);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review created successfully',
        data: newReview
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error creating review',
        data: null
      });
    }
  }

  // Get reviews for a product with pagination
  async getProductReviews(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      const { reviews, total } = await reviewsServices.getProductReviews(productId, limit, page);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews fetched successfully',
        meta: { page, limit, total },
        data: reviews
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching reviews',
        data: null
      });
    }
  }

  // Update a review
  async updateReview(req: Request, res: Response) {
    try {
      const reviewId = req.params.id;
      const reviewData = req.body;
      const updatedReview = await reviewsServices.updateReview(reviewId, reviewData);

      if (!updatedReview) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: 'Review not found',
          data: null
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: updatedReview
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error updating review',
        data: null
      });
    }
  }

  // Delete a review
  async deleteReview(req: Request, res: Response) {
    try {
      const reviewId = req.params.id;
      const deletedReview = await reviewsServices.deleteReview(reviewId);

      if (!deletedReview) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: 'Review not found',
          data: null
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully',
        data: deletedReview
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error deleting review',
        data: null
      });
    }
  }
}

export default new ReviewController();
