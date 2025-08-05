import CommentModel from "../models/Comment";

class CommentService{
    static async getCommentsByActivity(id: number){
        try {
            return await CommentModel.getCommentsByActivityId(id);
        }catch (error){
            console.log(error);
        }
    }

    static async createComment(userId:number, activityId:number, content: string){
        try {
            return await CommentModel.createComment(userId,activityId,content);
        }catch (error){
            console.log(error);
        }
    }

    static async createReply(userId:number, activityId:number, content: string, commentId: number){
        try {
            return await CommentModel.createComment(userId,activityId,content,commentId);
        }catch (error){
            console.log(error);
        }
    }

    static async getCommentById(id:number){
        try{
            return await CommentModel.getCommentById(id);
        }catch (error){
            console.log(error);
        }
    }
}

export default CommentService;