import path from 'path';
import dotenv from 'dotenv';

const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvVars {
    // MySQL 数据库配置
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_POOL_MAX: number;

    // 认证配置
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string | number;

    // 服务配置
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
}

const validateEnv = (): EnvVars => {
    // 确保在生产环境中对必要的环境变量进行强制验证
    if (process.env.NODE_ENV === 'production') {
        const requiredVars = [
            'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'
        ];
        requiredVars.forEach(varName => {
            if (!process.env[varName]) {
                throw new Error(`${varName} is required in production`);
            }
        });

        // 如果 JWT_SECRET 小于 32 个字符，则抛出错误
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters in production');
        }
    }

    // 类型转换和默认值设置
    return {
        // MySQL 配置
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
        DB_USER: process.env.DB_USER || 'root',
        DB_PASSWORD: process.env.DB_PASSWORD || '123456',
        DB_NAME: process.env.DB_NAME || 'WebDevelop',
        DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10', 10),

        // 认证配置
        JWT_SECRET: process.env.JWT_SECRET || 'default-dev-secret-32-chars-long-123',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

        // 服务配置
        PORT: parseInt(process.env.PORT || '3000', 10),
        NODE_ENV: (process.env.NODE_ENV as EnvVars['NODE_ENV']) || 'development'
    };
};

// 执行验证并导出环境变量
const env = validateEnv();
export default env;
