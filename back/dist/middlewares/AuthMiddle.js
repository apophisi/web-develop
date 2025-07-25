"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError_1.default('Not authorized to access this route', 401));
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return next(new AppError_1.default('User belonging to this token no longer exists', 401));
        }
        // 明确设置 user 属性
        req.user = {
            id: user.id.toString(),
            username: user.username,
            email: user.email
        };
        next();
    }
    catch (err) {
        next(new AppError_1.default('Invalid or expired token', 401));
    }
};
exports.authenticate = authenticate;
