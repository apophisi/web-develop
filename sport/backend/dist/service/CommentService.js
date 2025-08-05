"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = __importDefault(require("../models/Comment"));
class CommentService {
    static async getCommentsByActivity(id) {
        try {
            return await Comment_1.default.getCommentsByActivityId(id);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async createComment(userId, activityId, content) {
        try {
            return await Comment_1.default.createComment(userId, activityId, content);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async createReply(userId, activityId, content, commentId) {
        try {
            return await Comment_1.default.createComment(userId, activityId, content, commentId);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async getCommentById(id) {
        try {
            return await Comment_1.default.getCommentById(id);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = CommentService;
