import { Router } from 'express';
import userRoutes from './UserRoute';
import ossRoute from "./OssRoute";
import activityRoute from "./ActivityRoute";
import commentRoute from "./CommentRoute";

const router = Router();

router.use('/users', userRoutes);
router.use('/oss', ossRoute);
router.use('/activities', activityRoute);
router.use('/comments',commentRoute);

export default router;