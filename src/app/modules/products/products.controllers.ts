import { Request, Response } from 'express';
import productsServices from './products.services';
import sendResponse from '../../../shared/response';
import { IProduct } from './products.type';

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { name, category, brand, minPrice, maxPrice, sort, page, limit } = req.query;

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
}

export default new ProductController();
