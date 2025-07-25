"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ActivityController_1 = require("../controllers/ActivityController");
const AuthMiddle_1 = require("../middlewares/AuthMiddle");
const router = express_1.default.Router();
// 应用JWT验证中间件
router.use(AuthMiddle_1.authenticate);
// GET /api/v1/activities
router.get('/', ActivityController_1.getActivities);
// POST /api/v1/activities
router.post('/', ActivityController_1.createActivity);
// POST /api/v1/activities/:id/join
router.post('/:id/join', ActivityController_1.joinActivity);
exports.default = router;
