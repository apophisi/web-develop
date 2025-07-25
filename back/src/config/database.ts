import mysql from 'mysql2/promise';
import env from './env'; // 导入之前配置的环境变量

const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: env.DB_POOL_MAX,
    queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
    } catch (error) {
        console.error('❌ 数据库连接失败:', error);
        process.exit(1); // 连接失败时退出应用
    }
}

// 立即执行连接测试
testConnection();

export default pool;