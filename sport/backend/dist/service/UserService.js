"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserService {
    static async register(username, email, password, avatar) {
        const existingUser = await User_1.default.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Enum = 0;
        return User_1.default.create({ username, email, password: hashedPassword, avatar, enum: Enum });
    }
    static async login(email, password) {
        const user = await User_1.default.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(passwordMatch);
            throw new Error('密码错误');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, enum: user.enum }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    }
    static async getALLUsers() {
        const user = await User_1.default.findAll();
        if (!user) {
            console.log(222);
            throw new Error('未找到用户');
        }
        return user;
    }
    static async deleteUser(userId) {
        return await User_1.default.delete(userId);
    }
    static async setAdmin(userId) {
        return await User_1.default.setAdmin(userId);
    }
    static async verifyToken(token) {
        try {
            if (!token) {
                return { valid: false, error: '未提供令牌' };
            }
            if (!process.env.JWT_SECRET) {
                throw new Error('服务器配置错误');
            }
            // 1. JWT基础验证
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // 2. 检查用户是否存在
            const userExists = await this.checkUserExists(decoded.userId);
            if (!userExists) {
                return { valid: false, error: '用户不存在' };
            }
            return {
                valid: true,
                user: {
                    id: decoded.userId,
                    email: decoded.email,
                    enum: decoded.enum
                }
            };
        }
        catch (error) {
            return {
                valid: false,
                error: this.getJwtErrorMessage(error)
            };
        }
    }
    /**
     * 检查用户是否存在
     */
    static async checkUserExists(userId) {
        const user = await User_1.default.findById(userId);
        return !!user;
    }
    /**
     * 获取JWT错误友好信息
     */
    static getJwtErrorMessage(error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return '令牌已过期';
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return '无效令牌';
        }
        return '验证失败';
    }
}
exports.default = UserService;
