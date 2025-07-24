//环境配置
import dotenv from 'dotenv';
dotenv.config();

interface EnvVars {
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string | number;
    PORT: number;
    NODE_ENV?: 'development' | 'production' | 'test';
}

// 验证函数
const validateEnv = (): EnvVars => {
    // 生产环境强制验证关键变量
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is required in production');
        }
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters in production');
        }
    }

    // 类型安全的默认值处理
    const port = Number(process.env.PORT);
    return {
        MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/sports_room',
        JWT_SECRET: process.env.JWT_SECRET || 'default-dev-secret-32-chars-long-123',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '90d',
        PORT: isNaN(port) ? 3000 : port,
        NODE_ENV: process.env.NODE_ENV as EnvVars['NODE_ENV'] || 'development'
    };
};

const env = validateEnv();

export default env;