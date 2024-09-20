import Product from '../products/products.schema';
import Order from './orders.schema';
import { IOrder } from './orders.type';

class OrderService {
  // Create an order
  async createOrder(orderData: IOrder): Promise<IOrder> {
    try {
      // Iterate through each product in the order
      for (const item of orderData.products) {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }

        // Check if there's enough quantity
        if (product.quantity < item.quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }

        // Update the product quantity
        product.quantity -= item.quantity;
        await product.save();
      }
      // Create the order
      const newOrder = new Order(orderData);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new Error(`Order creation failed: ${(error as Error).message}`);
    }
  }

  // Get orders by user with pagination
  async getOrdersByUser(userId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments({ user: userId });
    const orders = await Order.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate('products.product')
      .populate('user');

    return { orders, total };
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<IOrder | null> {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return updatedOrder;
  }

  // Get all orders (for admin)
  async getAllOrders(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate('products.product')
      .populate('user');

    return { orders, total };
  }
}

export default new OrderService();
