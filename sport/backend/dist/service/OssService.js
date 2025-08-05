"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ossService = exports.OssService = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const path_1 = __importDefault(require("path"));
class OssService {
    constructor() {
        this.client = new ali_oss_1.default({
            region: process.env.OSS_REGION || 'oss-cn-shanghai',
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET_NAME,
        });
    }
    /**
     * 上传文件到OSS
     * @param file Express的Multer文件对象
     * @param userId 用户ID
     * @returns 文件URL
     */
    async uploadFile(file, userId) {
        // 生成唯一文件名: avatars/userId/timestamp.extension
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = `avatars/${userId}/${Date.now()}${fileExt}`;
        try {
            // 上传到OSS
            const result = await this.client.put(fileName, file.buffer, {
                headers: {
                    'Content-Type': file.mimetype,
                },
            });
            return result.url;
        }
        catch (error) {
            console.error('OSS上传失败:', error);
            throw new Error('文件上传失败');
        }
    }
}
exports.OssService = OssService;
exports.ossService = new OssService();
