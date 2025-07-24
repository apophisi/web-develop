import { Document } from 'mongoose';

// 定义用户基础类型
interface IUser {
    id: string;
    username: string;
    email: string;
}

// 扩展 Express 的 Request 类型
declare global {
    namespace Express {
        interface Request {
            user?: IUser | Document;
        }
    }
}