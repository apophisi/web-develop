"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentService_1 = __importDefault(require("../service/CommentService"));
class CommentController {
    static async getCommentsByActivity(req, res) {
        try {
            const activityId = parseInt(req.query.activityId);
            if (isNaN(activityId)) {
                return res.status(400).json({ message: '无效的活动id' });
            }
            const comments = await CommentService_1.default.getCommentsByActivity(activityId);
            return res.status(200).json(comments);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: '获取评论失败' });
        }
    }
    static async create(req, res) {
        try {
            const { userId, activityId, content } = req.body;
            if (!content) {
                return res.status(400).json({ message: '评论内容不能为空' });
            }
            const commentId = await CommentService_1.default.createComment(activityId, userId, content);
            const comment = await CommentService_1.default.getCommentById(commentId);
            res.status(201).json(comment);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: '评论创建失败' });
        }
    }
    static async reply(req, res) {
        try {
            const { userId, commentId, content } = req.body;
            if (!content) {
                return res.status(400).json({ message: '回复内容不能为空' });
            }
            // 检查父评论是否存在
            const parentComment = await CommentService_1.default.getCommentById(parseInt(commentId));
            if (!parentComment) {
                return res.status(404).json({ message: '评论不存在' });
            }
            const replyId = await CommentService_1.default.createReply(parentComment.activity_id, userId, content, parentComment.id);
            const reply = await CommentService_1.default.getCommentById(replyId);
            res.status(201).json(reply);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: '回复创建失败' });
        }
    }
}
exports.default = CommentController;
