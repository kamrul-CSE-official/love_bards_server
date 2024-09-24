import Order from '../orders/orders.schema';
import Product from '../products/products.schema';
import User from '../users/users.schema';

async function checkUserOrder(userId: string, productId: string): Promise<boolean> {
  // Check if the user exists
  const isUserExist = await User.findById(userId).select('_id');
  if (!isUserExist) {
    return false; // Return false if the user doesn't exist
  }

  // Check if the product exists
  const isProductExist = await Product.findById(productId).select('_id');
  if (!isProductExist) {
    return false; // Return false if the product doesn't exist
  }

  // Find an order where the user has purchased the specific product
  const order = await Order.findOne({
    user: userId,
    'products.product': productId,
  });
  return !!order; // Return true if the order exists, false otherwise
}

export default { checkUserOrder };
