import { Router } from 'express';
import UserController from '../controller/UserController';


const router = Router();

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/verify', UserController.verify);

router.get('/get',UserController.getAllUsers);

router.delete(`/delete/:userId`,UserController.deleteUser);

router.post('/set-admin/:userId',UserController.setAdmin);

export default router;