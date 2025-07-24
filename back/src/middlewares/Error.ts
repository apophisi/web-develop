//错误处理
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    logger.error(`Unexpected error: ${err.stack}`);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};