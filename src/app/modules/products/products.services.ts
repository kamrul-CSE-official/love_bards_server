import mongoose, { FilterQuery } from 'mongoose';
import { IProduct } from './products.type';
import Product from './products.schema';
import Order from '../orders/orders.schema';

interface ProductFilterOptions {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

class ProductService {
  // get products
  async getProducts(filterOptions: ProductFilterOptions) {
    const { name, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = filterOptions;

    // Create a filter object based on the user's filter options
    const filters: FilterQuery<IProduct> = {};

    // Filter by name (if provided) using case-insensitive search
    if (name) {
      filters.name = new RegExp(name, 'i'); // 'i' for case-insensitive
    }

    // Filter by category (if provided)
    if (category) {
      filters.category = category;
    }

    // Filter by brand (if provided)
    if (brand) {
      filters.brand = brand;
    }

    // Filter by price range (if provided)
    if (minPrice) filters.price = { ...filters.price, $gte: minPrice };
    if (maxPrice) filters.price = { ...filters.price, $lte: maxPrice };

    // Sort options based on user input
    const sortOptions: any = {};
    if (sort) {
      switch (sort) {
        case 'price-high-to-low':
          sortOptions.price = -1;
          break;
        case 'price-low-to-high':
          sortOptions.price = 1;
          break;
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        case 'popularity':
          sortOptions.visitors = -1;
          break;
      }
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch products with filters, sorting, and pagination
    const products = await Product.find(filters).sort(sortOptions).skip(skip).limit(limit);

    // Count total products for pagination
    const totalProducts = await Product.countDocuments(filters);

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    };
  }

  // search products
  async searchProducts(filterOptions: ProductFilterOptions) {
    const { name, page = 1, limit = 12 } = filterOptions;

    // Create a filter object based on the user's filter options
    const filters: FilterQuery<IProduct> = {};

    // Filter by name (if provided) using case-insensitive search
    if (name) {
      filters.name = new RegExp(name, 'i'); // 'i' for case-insensitive
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch products with filters, sorting, and pagination
    const products = await Product.find(filters).skip(skip).limit(limit);

    // Count total products for pagination
    const totalProducts = await Product.countDocuments(filters);

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    };
  }

  // Additional service to get a product by ID
  async getProductById(id: string) {
    // Fetch the product by its ID
    const product = await Product.findById(id).populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name'
      }
    });

    if (!product) throw new Error('Product not found');

    // Call the incrementVisitors method on the product instance
    await product.incrementVisitors();

    return product;
  }

  // Fetch best selling products with pagination
  async getBestSellingProducts(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    const bestSellingProducts = await Product.find().sort({ sold: -1 }).skip(skip).limit(limit);

    return { products: bestSellingProducts, total };
  }

  // Fetch top visited products with pagination
  async getTopVisitedProducts(limit: number = 10, page: number = 1) {
    try {
      // Ensure limit and page have valid values
      limit = limit > 0 ? limit : 10;
      page = page > 0 ? page : 1;
      const skip = (page - 1) * limit;

      // Fetch total count of products that have visitors (ignoring products with 0 visitors if necessary)
      const totalProducts = await Product.countDocuments({ visitors: { $gt: 0 } });

      // Fetch products sorted by visitor count in descending order
      const topVisitedProducts = await Product.find({ visitors: { $gt: 0 } }) // Only fetch products with > 0 visitors
        .sort({ visitors: -1 }) // Sort products by visitor count in descending order
        .skip(skip) // Skip records for pagination
        .limit(limit); // Limit the number of results returned

      // Calculate total pages based on total products and limit per page
      const totalPages = Math.ceil(totalProducts / limit);

      // Return the products along with metadata for pagination
      return {
        products: topVisitedProducts,
        meta: {
          totalProducts,
          totalPages,
          currentPage: page,
          limitPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Error fetching top visited products: ${(error as Error).message}`);
    }
  }

  // Fetch related products (You May Like) with pagination
  async getRelatedProducts(productId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments({ _id: { $ne: productId } });
    const relatedProducts = await Product.find({ _id: { $ne: productId } })
      .limit(limit)
      .skip(skip);

    return { products: relatedProducts, total };
  }

  // Add multiple products
  async addMultipleProducts(productsData: IProduct[]) {
    const products = await Product.insertMany(productsData);
    return products;
  }

  // Is user bought this product
  async isProductBought(userId: string, productId: string): Promise<boolean> {
    try {
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid user or product ID');
      }

      // Log the ObjectIds to verify their validity
      console.log('UserId:', userId, 'ProductId:', productId);

      const findOrder = await Order.findOne({
        user: new mongoose.Types.ObjectId(userId),
        products: {
          $elemMatch: { product: new mongoose.Types.ObjectId(productId) }
        }
      }).select('_id');

      // Log the result of the query
      console.log('findOrder result:', findOrder);

      // Return true if an order is found, otherwise false
      return !!findOrder;
    } catch (error) {
      console.error('Error checking if product was bought:', error);
      throw new Error('Unable to verify product purchase status');
    }
  }
}

export default new ProductService();
