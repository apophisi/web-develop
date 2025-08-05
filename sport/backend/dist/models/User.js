"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static async create(user) {
        const [result] = await database_1.default.query('INSERT INTO users (username, email, password, image_url, enum) VALUES (?, ?, ?, ?, ?)', [user.username, user.email, user.password, user.avatar, user.enum]);
        const insertedUser = await this.findById(result.insertId);
        if (!insertedUser) {
            throw new Error('Failed to create user');
        }
        return insertedUser;
    }
    static async findByEmail(email) {
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }
    static async findMessageById(id) {
        const [rows] = await database_1.default.query('SELECT users.id, users.username, users.email, users.enum, users.created_at FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }
    static async findAll() {
        const [rows] = await database_1.default.query('SELECT users.id, users.username, users.email, users.enum, users.created_at FROM users');
        return rows;
    }
    static async delete(id) {
        const [activityIds] = await database_1.default.query('SELECT activity_id FROM activity_registrations WHERE user_id = ?', [id]);
        for (const { activity_id } of activityIds) {
            await database_1.default.query('UPDATE activities SET registered_count = registered_count - 1 WHERE id = ?', [activity_id]);
        }
        await database_1.default.query('DELETE FROM activity_registrations where user_id = ?', [id]);
        const [rows] = await database_1.default.query('DELETE FROM users WHERE id = ?', [id]);
        return rows.affectedRows > 0;
    }
    static async setAdmin(id) {
        const [rows] = await database_1.default.query('UPDATE users SET enum = 1 WHERE id = ?', [id]);
        if (rows.affectedRows > 0) {
            return await this.findMessageById(id);
        }
        return null;
    }
}
exports.default = UserModel;
