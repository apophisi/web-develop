"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OssController_1 = require("../controller/OssController");
const router = express_1.default.Router();
// 头像上传接口
router.post('/avatar', OssController_1.uploadController.getMiddleware(), OssController_1.uploadController.uploadAvatar);
exports.default = router;
