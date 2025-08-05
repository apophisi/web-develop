"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class CommentModel {
    static async getCommentsByActivityId(activityId) {
        // 获取顶级评论（parent_id为null的评论）
        const [comments] = await database_1.default.query(`
            SELECT c.*, 
                   u.id as 'user.id', 
                   u.username as 'user.username', 
                   u.image_url as 'user.image_url'
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.activity_id = ? AND c.parent_id IS NULL
            ORDER BY c.created_at DESC
        `, [activityId]);
        // 获取每条评论的回复
        for (const comment of comments) {
            const [replies] = await database_1.default.query(`
                SELECT c.*, 
                       u.id as 'user.id', 
                       u.username as 'user.username', 
                       u.image_url as 'user.image_url'
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.parent_id = ?
                ORDER BY c.created_at ASC
            `, [comment.id]);
            comment.replies = replies;
        }
        return comments;
    }
    // 创建评论
    static async createComment(activityId, userId, content, parentId) {
        const [result] = await database_1.default.query(`
            INSERT INTO comments (content, activity_id, user_id, parent_id)
            VALUES (?, ?, ?, ?)
        `, [content, activityId, userId, parentId || null]);
        return result.insertId;
    }
    // 获取单个评论
    static async getCommentById(id) {
        const [rows] = await database_1.default.query(`
            SELECT c.*, 
                   u.id as 'user.id', 
                   u.username as 'user.username', 
                   u.image_url as 'user.image_url'
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `, [id]);
        return rows[0] || null;
    }
}
exports.default = CommentModel;
