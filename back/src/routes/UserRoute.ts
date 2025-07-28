import { Router } from 'express';
import UserController from '../controller/UserController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/verify', UserController.verify);

export default router;