//认证中间件
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';
import AppError from '../utils/AppError';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('User belonging to this token no longer exists', 401));
        }

        // 明确设置 user 属性
        req.user = {
            id: user.id.toString(),
            username: user.username,
            email: user.email
        };

        next();
    } catch (err) {
        next(new AppError('Invalid or expired token', 401));
    }
};