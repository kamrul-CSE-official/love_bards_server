import { Router } from 'express';
import usersControllers from './users.controllers';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/register', usersControllers.register);
router.post('/login', usersControllers.login);
router.get('/:id', auth(), usersControllers.getUser);

export default router;
