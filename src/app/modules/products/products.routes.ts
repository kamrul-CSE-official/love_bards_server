import { Router } from 'express';
import productsControllers from './products.controllers';
import protectRoute from '../../middlewares/auth';

const router = Router();

// Define routes for products
router.get('/', productsControllers.getProducts); // GET /products?name=...&category=...&brand=...&page=...

router.get('/search', productsControllers.searchProducts);

router.get('/best-sellers', productsControllers.getBestSellingProducts);

router.get('/top-visited', productsControllers.getTopVisitedProducts);

router.get('/:id/related', productsControllers.getRelatedProducts);

router.get('/:id', productsControllers.getProductById); // GET /products/:id

router.get('/is-bought/:productId', protectRoute, productsControllers.isProductBought);

router.post('/batch', protectRoute, productsControllers.addMultipleProducts);





export default router;
