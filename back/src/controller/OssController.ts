import { Request, Response } from 'express';
import { ossService } from '../service/OssService';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// 配置Multer内存存储
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 限制2MB
        files: 1, // 只允许一个文件
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件'));
        }
    },
});

export class UploadController {
    /**
     * 上传头像
     */
    async uploadAvatar(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '请提供头像文件' });
            }

            // 使用临时userId或从请求中获取
            const userId = req.body.userId || uuidv4();
            const fileUrl = await ossService.uploadFile(req.file, userId);

            res.json({
                url: fileUrl,
                message: '头像上传成功',
            });
        } catch (error) {
            console.error('头像上传错误:', error);
            res.status(500).json({
                error: error instanceof Error ? error.message : '上传失败'
            });
        }
    }

    // 获取Multer中间件
    getMiddleware() {
        return upload.single('image_url');
    }
}

export const uploadController = new UploadController();