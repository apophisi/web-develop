"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = __importDefault(require("./env")); // 导入之前配置的环境变量
const pool = promise_1.default.createPool({
    host: env_1.default.DB_HOST,
    user: env_1.default.DB_USER,
    password: env_1.default.DB_PASSWORD,
    database: env_1.default.DB_NAME,
    waitForConnections: true,
    connectionLimit: env_1.default.DB_POOL_MAX,
    queueLimit: 0
});
// 测试数据库连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
    }
    catch (error) {
        console.error('❌ 数据库连接失败:', error);
        process.exit(1); // 连接失败时退出应用
    }
}
// 立即执行连接测试
testConnection();
exports.default = pool;
