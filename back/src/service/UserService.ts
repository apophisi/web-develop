import UserModel from '../models/User';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

interface DecodedToken extends JwtPayload {
    userId: number;
    email: string;
}

class UserService {
    static async register(username: string, email: string, password: string, avatar:string) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(avatar);
        return UserModel.create({ username, email, password: hashedPassword, avatar});
    }

    static async login(email: string, password: string) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(passwordMatch);
            throw new Error('密码错误');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    static async verifyToken(token?: string): Promise<{
        valid: boolean;
        user?: { id: number; email: string };
        error?: string;
    }> {
        try {
            if(!token){
                return {valid: false, error: '未提供令牌'};
            }

            if (!process.env.JWT_SECRET) {
                throw new Error('服务器配置错误');
            }

            // 1. JWT基础验证
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

            // 2. 检查用户是否存在
            const userExists = await this.checkUserExists(decoded.userId);
            if (!userExists) {
                return { valid: false, error: '用户不存在' };
            }

            return {
                valid: true,
                user: {
                    id: decoded.userId,
                    email: decoded.email
                }
            };

        } catch (error) {
            return {
                valid: false,
                error: this.getJwtErrorMessage(error)
            };
        }
    }

    /**
     * 检查用户是否存在
     */
    private static async checkUserExists(userId: number): Promise<boolean> {
        const user = await UserModel.findById(userId);
        return !!user;
    }

    /**
     * 获取JWT错误友好信息
     */
    private static getJwtErrorMessage(error: unknown): string {
        if (error instanceof jwt.TokenExpiredError) {
            return '令牌已过期';
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return '无效令牌';
        }
        return '验证失败';
    }
}

export default UserService;