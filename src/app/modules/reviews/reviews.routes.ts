import express from 'express';
import reviewsControllers from './reviews.controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create a new review
router.post('/', auth(), reviewsControllers.createReview);

// Get reviews for a product (with pagination)
router.get('/product/:productId', reviewsControllers.getProductReviews);

// Update a review by ID
router.patch('/:id', auth(), reviewsControllers.updateReview);

// Delete a review by ID
router.delete('/:id', auth(), reviewsControllers.deleteReview);

export default router;
