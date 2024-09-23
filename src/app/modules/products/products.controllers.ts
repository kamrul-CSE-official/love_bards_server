import { Request, Response } from 'express';
import productsServices from './products.services';
import sendResponse from '../../../shared/response';
import { IProduct } from './products.type';
import { AuthenticatedRequest } from '../../middlewares/auth';

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { name, category, brand, minPrice, maxPrice, sort, page, limit } = req?.query;

      const filterOptions = {
        name: name as string,
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12
      };

      const productsData = await productsServices.getProducts(filterOptions);

      // Use sendResponse for standardized responses
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        meta: {
          page: productsData.currentPage,
          limit: filterOptions.limit,
          total: productsData.totalProducts
        },
        data: productsData.products
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching products',
        data: null
      });
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const { name, page, limit } = req?.query;

      const filterOptions = {
        name: name as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12
      };

      const productsData = await productsServices.searchProducts(filterOptions);

      // Use sendResponse for standardized responses
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        meta: {
          page: productsData.currentPage,
          limit: filterOptions.limit,
          total: productsData.totalProducts
        },
        data: productsData.products
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching products',
        data: null
      });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productsServices.getProductById(id);

      sendResponse<IProduct>(res, {
        statusCode: 200,
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Product not found',
        data: null
      });
    }
  }

  // Get best selling products with pagination
  async getBestSellingProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      const { products, total } = await productsServices.getBestSellingProducts(limit, page);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Best selling products retrieved successfully',
        meta: {
          page,
          limit,
          total
        },
        data: products
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching best selling products',
        data: null
      });
    }
  }

  // Get top visited products with pagination
  async getTopVisitedProducts(req: Request, res: Response) {
    try {
      console.log('Fetching top visited products...');

      // Parse query parameters for pagination
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;

      // Fetch the top visited products from the service
      const { products, meta } = await productsServices.getTopVisitedProducts(limit, page);

      // Send the response with metadata for pagination
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Top visited products retrieved successfully',
        meta: {
          page: meta.currentPage,
          limit: meta.limitPerPage,
          total: meta.totalProducts,
          totalPages: meta.totalPages
        },
        data: products
      });
    } catch (error) {
      console.error('Error fetching top visited products:', error);

      // Send an error response
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching top visited products',
        data: null
      });
    }
  }

  // Get related products with pagination
  async getRelatedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      const productId = req.params.id; // Assuming product ID is passed in the URL
      const { products, total } = await productsServices.getRelatedProducts(productId, limit, page);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Related products retrieved successfully',
        meta: {
          page,
          limit,
          total
        },
        data: products
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching related products',
        data: null
      });
    }
  }

  // Add multiple products
  async addMultipleProducts(req: Request, res: Response) {
    try {
      const productsData = req.body; // Expecting an array of product objects
      const products = await productsServices.addMultipleProducts(productsData);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Products added successfully',
        data: products
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error adding products',
        data: null
      });
    }
  }

  // Is this product bought
  async isProductBought(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req?.user?.userId as string;
      const productId = req?.params?.productId as string;

      // Await the service result
      const result = await productsServices.isProductBought(userId, productId);

      // Send a success response
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product purchase status fetched successfully.',
        data: result
      });
    } catch (error) {
      console.log('Error fetching product purchase status:', error);

      // Send an error response
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Error fetching product purchase status!',
        data: null
      });
    }
  }
}

export default new ProductController();
