import express from 'express';
import ordersControllers from './orders.controllers';
import protectRoute from '../../middlewares/auth';

const router = express.Router();

// Create a new order
router.post('/', protectRoute, ordersControllers.createOrder);

// Get orders by user (with pagination)
router.get('/user/:userId', protectRoute, ordersControllers.getOrdersByUser);

// Update order status
router.patch('/:id/status', protectRoute, ordersControllers.updateOrderStatus);

// Get all orders (admin view) with pagination
router.get('/', protectRoute, ordersControllers.getAllOrders);

export default router;
