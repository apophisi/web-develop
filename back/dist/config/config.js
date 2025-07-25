"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.getConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
let pool;
const createPool = () => {
    pool = promise_1.default.createPool({
        host: env_1.default.DB_HOST,
        port: env_1.default.DB_PORT,
        user: env_1.default.DB_USER,
        password: env_1.default.DB_PASSWORD,
        database: env_1.default.DB_NAME,
        waitForConnections: true,
        connectionLimit: env_1.default.DB_POOL_MAX,
        queueLimit: 0
    });
    pool.on('connection', (conn) => {
        logger_1.default.debug(`MySQL connection established (ID: ${conn.threadId})`);
    });
    pool.on('acquire', (conn) => {
        logger_1.default.debug(`Connection acquired (ID: ${conn.threadId})`);
    });
    return pool;
};
const getConnection = () => {
    if (!pool)
        createPool();
    return pool.getConnection();
};
exports.getConnection = getConnection;
// 测试连接
const testConnection = async () => {
    const conn = await (0, exports.getConnection)();
    try {
        const [rows] = await conn.query('SELECT 1 + 1 AS result');
        logger_1.default.info('✅ MySQL connected successfully');
        return rows;
    }
    finally {
        conn.release();
    }
};
exports.testConnection = testConnection;
