import OSS from 'ali-oss';
import { Request } from 'express';
import path from 'path';
import multer from 'multer';

export class OssService {
    private client: OSS;

    constructor() {
        this.client = new OSS({
            region: process.env.OSS_REGION || 'oss-cn-shanghai',
            accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
            bucket: process.env.OSS_BUCKET_NAME!,
        });
    }

    /**
     * 上传文件到OSS
     * @param file Express的Multer文件对象
     * @param userId 用户ID
     * @returns 文件URL
     */
    async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
        // 生成唯一文件名: avatars/userId/timestamp.extension
        const fileExt = path.extname(file.originalname);
        const fileName = `avatars/${userId}/${Date.now()}${fileExt}`;

        try {
            // 上传到OSS
            const result = await this.client.put(fileName, file.buffer, {
                headers: {
                    'Content-Type': file.mimetype,
                },
            });

            return result.url;
        } catch (error) {
            console.error('OSS上传失败:', error);
            throw new Error('文件上传失败');
        }
    }
}

export const ossService = new OssService();