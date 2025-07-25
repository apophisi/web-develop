import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket , PoolConnection} from 'mysql2';

/**
 * 基础用户类型
 * 对应 users 表结构
 */
export interface IUser extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date | null;
}

declare global {
    namespace Express{
        interface Request{
            user ?: IUser;
        }
    }
}

/**
 * 活动类型
 * 对应 activities 表结构
 */
export interface IActivity extends RowDataPacket {
    id: number;
    title: string;
    description: string | null;
    date: Date;
    location: string;
    max_participants: number;
    creator_id: number;
    created_at: Date;
}

/**
 * 数据库操作结果类型
 */
export type QueryResult<T = any> = [
    (
        | T[]
        | ResultSetHeader
        | OkPacket
        | OkPacket[]
        | ResultSetHeader[]
        ),
    FieldPacket[]
];

/**
 * 分页查询结果
 */
export interface PaginatedResult<T extends RowDataPacket> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        perPage: number;
    };
}

/**
 * 扩展 mysql2 类型声明
 */
declare module 'mysql2' {
    interface OkPacket {
        insertId: number;
        affectedRows: number;
    }

    interface ResultSetHeader {
        insertId: number;
        affectedRows: number;
        changedRows: number;
    }
}

/**
 * 事务回调函数类型
 */
export type TransactionCallback<T = any> = (
    connection: PoolConnection
) => Promise<T>;

export type {OkPacket}