import express from 'express';
import productsRoutes from '../modules/products/products.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/products',
    routes: productsRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
