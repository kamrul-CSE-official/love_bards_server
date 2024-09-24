import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ordersServices from './orders.services';
import sendResponse from '../../../shared/response';

dotenv.config({ path: path.join(process.cwd(), '.env') });

class OrderController {
  // Create a new order
  async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body;


      const newOrder = await ordersServices.createOrder(orderData);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Order created successfully',
        data: newOrder
      });
    } catch (error: any) {
      console.error('Error creating order:', error.message); // Log the error message for debugging

      // Optionally, you can send back a more detailed error message for debugging in development
      const errorMessage =
        process.env.NODE_ENV === 'development' ? error.message : 'Error creating order';

      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: errorMessage,
        data: null
      });
    }
  }

  // Get orders by user with pagination
  async getOrdersByUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      const { orders, total } = await ordersServices.getOrdersByUser(userId, limit, page);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Orders fetched successfully',
        meta: { page, limit, total },
        data: orders
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching orders',
        data: null
      });
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const updatedOrder = await ordersServices.updateOrderStatus(orderId, status);

      if (!updatedOrder) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: 'Order not found',
          data: null
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error updating order status',
        data: null
      });
    }
  }

  // Get all orders (for admin) with pagination
  async getAllOrders(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      const { orders, total } = await ordersServices.getAllOrders(limit, page);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Orders fetched successfully',
        meta: { page, limit, total },
        data: orders
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching orders',
        data: null
      });
    }
  }
}

export default new OrderController();
