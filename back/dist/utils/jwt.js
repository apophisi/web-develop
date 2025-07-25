"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
// jwt工具
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const signToken = (payload, options) => {
    // 明确的类型断言和验证
    const secret = env_1.default.JWT_SECRET;
    if (!secret || typeof secret !== 'string') {
        throw new Error('JWT_SECRET must be a valid string');
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        ...options,
        expiresIn: options?.expiresIn || env_1.default.JWT_EXPIRES_IN
    } // 明确类型断言
    );
};
exports.signToken = signToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
};
exports.verifyToken = verifyToken;
