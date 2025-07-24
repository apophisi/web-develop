//验证中间件
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../utils/AppError';

export const validate = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
};