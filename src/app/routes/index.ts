import express from 'express';
import productsRoutes from '../modules/products/products.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import reviewsRoutes from '../modules/reviews/reviews.routes';
import usersRoutes from '../modules/users/users.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/products',
    routes: productsRoutes
  },
  {
    path: '/orders',
    routes: ordersRoutes
  },
  {
    path: '/reviews',
    routes: reviewsRoutes
  },
  {
    path: '/users',
    routes: usersRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
