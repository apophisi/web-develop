"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class ActivityModel {
    static async create(activity) {
        const [rows] = await database_1.default.query('INSERT INTO activities (title, description, date, location, participants, image) VALUES (?, ?, ?, ?, ?, ?)', [activity.title, activity.description, activity.date, activity.location, activity.participants, activity.image]);
        const insertedActivity = await this.findById(rows.insertId);
        if (!insertedActivity) {
            throw new Error('Failed to create activity');
        }
        return insertedActivity;
    }
    static async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM activities WHERE id = ?', [id]);
        return rows[0] || null;
    }
    static async findAll() {
        const [rows] = await database_1.default.query('SELECT * FROM activities ORDER BY date DESC');
        return rows;
    }
    static async update(id, activity) {
        const [rows] = await database_1.default.query('UPDATE activities SET title = ?, description = ?, date = ?, location = ?, participants = ?, image = ? WHERE id = ?', [activity.title, activity.description, activity.date, activity.location, activity.participants, activity.image, id]);
        if (rows.affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }
    static async delete(id) {
        await database_1.default.query('DELETE FROM activity_registrations where activity_id = ?', [id]);
        await database_1.default.query('DELETE FROM comments where activity_id = ?', [id]);
        const [rows] = await database_1.default.query('DELETE FROM activities WHERE id = ?', [id]);
        return rows.affectedRows > 0;
    }
    static async getRegisteredActivities(id) {
        const [rows] = await database_1.default.query(`
                SELECT a.* FROM activities a
                JOIN activity_registrations ar ON a.id = ar.activity_id
                WHERE ar.user_id = ?
                ORDER BY a.date DESC
            `, [id]);
        return rows || null;
    }
    static async registerActivity(ar) {
        const activity = await this.findById(ar.activity_id);
        if (!activity || activity.registered_count >= activity.participants) {
            console.log('1');
            return false;
        }
        const [existing] = await database_1.default.query('SELECT * FROM activity_registrations WHERE user_id = ? AND activity_id = ?', [ar.user_id, ar.activity_id]);
        if (!(existing.length === 0)) {
            console.log(existing);
            return false;
        }
        await database_1.default.query('START TRANSACTION');
        try {
            // 添加报名记录
            await database_1.default.query('INSERT INTO activity_registrations (user_id, activity_id) VALUES (?, ?)', [ar.user_id, ar.activity_id]);
            // 更新活动报名人数
            await database_1.default.query('UPDATE activities SET registered_count = registered_count + 1 WHERE id = ?', [ar.activity_id]);
            await database_1.default.query('COMMIT');
        }
        catch (err) {
            await database_1.default.query('ROLLBACK');
            throw err;
        }
        return true;
    }
    static async cancelRegistration(userId, activityId) {
        const [existing] = await database_1.default.query('SELECT * FROM activity_registrations WHERE user_id = ? AND activity_id = ? FOR UPDATE', [userId, activityId]);
        if (existing.length === 0)
            return false;
        await database_1.default.query('DELETE FROM activity_registrations WHERE user_id = ? AND activity_id = ?', [userId, activityId]);
        await database_1.default.query('UPDATE activities SET registered_count = registered_count - 1 WHERE id = ?', [activityId]);
        return true;
    }
    static async checkRegistration(userId, activityId) {
        const [existing] = await database_1.default.query('SELECT * FROM activity_registrations WHERE user_id = ? AND  activity_id = ? FOR UPDATE', [userId, activityId]);
        return existing.length !== 0;
    }
}
exports.default = ActivityModel;
