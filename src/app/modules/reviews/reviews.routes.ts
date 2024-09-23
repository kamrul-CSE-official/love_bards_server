import express from 'express';
import reviewsControllers from './reviews.controllers';
import protectRoute from '../../middlewares/auth';

const router = express.Router();

// Create a new review
router.post('/', protectRoute, reviewsControllers.createReview);

// Get reviews for a product (with pagination)
router.get('/product/:productId', reviewsControllers.getProductReviews);

// Update a review by ID
router.patch('/:id', protectRoute, reviewsControllers.updateReview);

// Delete a review by ID
router.delete('/:id', protectRoute, reviewsControllers.deleteReview);

export default router;
