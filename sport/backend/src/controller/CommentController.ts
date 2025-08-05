import { Request, Response } from 'express';
import CommentService from "../service/CommentService";

class CommentController{
    static async getCommentsByActivity(req: Request, res: Response){
        try{
            const activityId = parseInt(req.query.activityId as string);

            if (isNaN(activityId)){
                return res.status(400).json({message: '无效的活动id'});
            }

            const comments = await CommentService.getCommentsByActivity(activityId);

            return res.status(200).json(comments);
        }catch(error: any){
            console.log(error);
            res.status(500).json({message: '获取评论失败'});
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const {userId, activityId, content } = req.body;

            if (!content) {
                return res.status(400).json({ message: '评论内容不能为空' });
            }

            const commentId = await CommentService.createComment(activityId, userId, content);
            const comment = await CommentService.getCommentById(commentId as number);

            res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '评论创建失败' });
        }
    }

    static async reply(req: Request, res: Response) {
        try {
            const {userId, commentId, content} = req.body;

            if (!content) {
                return res.status(400).json({ message: '回复内容不能为空' });
            }

            // 检查父评论是否存在
            const parentComment = await CommentService.getCommentById(parseInt(commentId));
            if (!parentComment) {
                return res.status(404).json({ message: '评论不存在' });
            }

            const replyId = await CommentService.createReply(
                parentComment.activity_id,
                userId,
                content,
                parentComment.id
            );

            const reply = await CommentService.getCommentById(replyId as number);

            res.status(201).json(reply);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '回复创建失败' });
        }
    }
}

export default CommentController;