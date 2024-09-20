import express from 'express';
import { academicSemesterRouters } from '../modules/academicSemester/academicSemester.reoutes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    routes: academicSemesterRouters
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
