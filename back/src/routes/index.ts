import { Router } from 'express';
import userRoutes from './UserRoute';
import ossRoute from "./OssRoute";

const router = Router();

router.use('/users', userRoutes);
router.use('/oss',ossRoute);

export default router;