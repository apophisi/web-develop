"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CommentController_1 = __importDefault(require("../controller/CommentController"));
const router = express_1.default.Router();
router.get('/', CommentController_1.default.getCommentsByActivity);
router.post('/create', CommentController_1.default.create);
router.post('/reply', CommentController_1.default.reply);
exports.default = router;
