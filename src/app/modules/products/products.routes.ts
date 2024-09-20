import { Router } from 'express';
import productsControllers from './products.controllers';

const router = Router();

// Define routes for products
router.get('/', productsControllers.getProducts); // GET /products?name=...&category=...&brand=...&page=...
router.get('/:id', productsControllers.getProductById); // GET /products/:id

export default router;
