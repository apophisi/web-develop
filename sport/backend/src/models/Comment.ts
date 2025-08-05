import pool from "../config/database";
import {RowDataPacket} from "mysql2";

interface Comment extends RowDataPacket{
    id: number;
    content: string;
    activity_id: number;
    user_id: number;
    parent_id: number | null;
    created_at: Date;
    user: {
        id: number;
        username: string;
        image_url: string | null;
    };
    replies?: Comment[];
}

class CommentModel{
    static async getCommentsByActivityId(activityId: number): Promise<Comment[]> {
        // 获取顶级评论（parent_id为null的评论）
        const [comments] = await pool.query<Comment[]>(`
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
            const [replies] = await pool.query<Comment[]>(`
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
    static async createComment(activityId: number, userId: number, content: string, parentId?: number): Promise<number> {
        const [result] = await pool.query(`
            INSERT INTO comments (content, activity_id, user_id, parent_id)
            VALUES (?, ?, ?, ?)
        `, [content, activityId, userId, parentId || null]);

        return (result as any).insertId;
    }

    // 获取单个评论
    static async getCommentById(id: number): Promise<Comment | null> {
        const [rows] = await pool.query<Comment[]>(`
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

export default CommentModel;