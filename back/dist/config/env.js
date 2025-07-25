"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateEnv = () => {
    // 生产环境强制验证
    if (process.env.NODE_ENV === 'production') {
        const requiredVars = [
            'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'
        ];
        requiredVars.forEach(varName => {
            if (!process.env[varName]) {
                throw new Error(`${varName} is required in production`);
            }
        });
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters in production');
        }
    }
    // 类型转换和默认值
    return {
        // MySQL 配置
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: parseInt(process.env.DB_PORT || '3306'),
        DB_USER: process.env.DB_USER || 'root',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_NAME: process.env.DB_NAME || 'sports_room',
        DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10'),
        // 认证配置
        JWT_SECRET: process.env.JWT_SECRET || 'default-dev-secret-32-chars-long-123',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        // 服务配置
        PORT: parseInt(process.env.PORT || '3000'),
        NODE_ENV: process.env.NODE_ENV || 'development'
    };
};
const env = validateEnv();
exports.default = env;
