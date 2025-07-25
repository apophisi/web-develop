"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const config_1 = require("../config/config"); // 建议重命名为 db.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // 1. 密码哈希
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // 2. 获取数据库连接
        const conn = await (0, config_1.getConnection)();
        try {
            // 3. 执行插入
            const [result] = await conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
            // 4. 生成 JWT
            const token = (0, jwt_1.signToken)({ id: result.insertId });
            return res.status(201).json({ token });
        }
        finally {
            conn.release();
        }
    }
    catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const conn = await (0, config_1.getConnection)();
        try {
            // 1. 查询用户
            const [users] = await conn.execute('SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1', [email]);
            // 2. 验证用户
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const user = users[0];
            if (user == null) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // 3. 生成 JWT
            const token = (0, jwt_1.signToken)({ id: user.id });
            return res.json({ token });
        }
        finally {
            conn.release();
        }
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
