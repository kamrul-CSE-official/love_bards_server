import { FilterQuery } from 'mongoose';
import { IProduct } from './products.type';
import Product from './products.schema';

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
  async getProducts(filterOptions: ProductFilterOptions) {
    const { name, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = filterOptions;

    // Create a filter object based on options
    const filters: FilterQuery<IProduct> = {};

    if (name) filters.name = new RegExp(name, 'i'); // case-insensitive search
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (minPrice) filters.price = { ...filters.price, $gte: minPrice };
    if (maxPrice) filters.price = { ...filters.price, $lte: maxPrice };

    // Sort options
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

    const skip = (page - 1) * limit;

    // Fetch products with filters, sort, pagination
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

  // Additional service to get a product by ID
  async getProductById(id: string) {
    const product = await Product.findById(id).populate('reviews');
    if (!product) throw new Error('Product not found');
    return product;
  }
}

export default new ProductService();
