import express from "express";
import CommentController from "../controller/CommentController";

const router = express.Router();

router.get('/',CommentController.getCommentsByActivity);

router.post('/create', CommentController.create);

router.post('/reply', CommentController.reply);

export default router;