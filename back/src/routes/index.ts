import { Router } from 'express';
import userRoutes from './UserRoutes';

const router = Router();

router.use('/users', userRoutes);

export default router;