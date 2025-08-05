import express from 'express';
import { uploadController } from '../controller/OssController';

const router = express.Router();

// 头像上传接口
router.post(
    '/avatar',
    uploadController.getMiddleware(),
    uploadController.uploadAvatar
);

export default router;