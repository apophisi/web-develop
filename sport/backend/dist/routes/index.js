"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRoute_1 = __importDefault(require("./UserRoute"));
const OssRoute_1 = __importDefault(require("./OssRoute"));
const ActivityRoute_1 = __importDefault(require("./ActivityRoute"));
const CommentRoute_1 = __importDefault(require("./CommentRoute"));
const router = (0, express_1.Router)();
router.use('/users', UserRoute_1.default);
router.use('/oss', OssRoute_1.default);
router.use('/activities', ActivityRoute_1.default);
router.use('/comments', CommentRoute_1.default);
exports.default = router;
