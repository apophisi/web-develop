"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = exports.UploadController = void 0;
const OssService_1 = require("../service/OssService");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
// 配置Multer内存存储
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 限制2MB
        files: 1, // 只允许一个文件
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('只允许上传图片文件'));
        }
    },
});
class UploadController {
    /**
     * 上传头像
     */
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '请提供头像文件' });
            }
            // 使用临时userId或从请求中获取
            const userId = req.body.userId || (0, uuid_1.v4)();
            const fileUrl = await OssService_1.ossService.uploadFile(req.file, userId);
            res.json({
                url: fileUrl,
                message: '头像上传成功',
            });
        }
        catch (error) {
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
exports.UploadController = UploadController;
exports.uploadController = new UploadController();
