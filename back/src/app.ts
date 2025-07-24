import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/AuthRoute';
import activityRouter from './routes/ActivityRoute';
import { errorHandler } from './middlewares/Error';
import './types/express'

const app = express();

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 路由
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/activities', activityRouter);

// 错误处理
app.use(errorHandler);

export default app;