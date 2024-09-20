import express from 'express';
import ordersControllers from './orders.controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create a new order
router.post('/', auth(), ordersControllers.createOrder);

// Get orders by user (with pagination)
router.get('/user/:userId', auth(), ordersControllers.getOrdersByUser);

// Update order status
router.patch('/:id/status', auth(), ordersControllers.updateOrderStatus);

// Get all orders (admin view) with pagination
router.get('/', auth(), ordersControllers.getAllOrders);

export default router;
