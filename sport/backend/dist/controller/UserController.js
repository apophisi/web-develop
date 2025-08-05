"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = __importDefault(require("../service/UserService"));
class UserController {
    static async register(req, res) {
        try {
            console.log(req);
            const { username, email, password, avatar } = req.body;
            const user = await UserService_1.default.register(username, email, password, avatar);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await UserService_1.default.login(email, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async verify(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ valid: false, error: '未提供认证令牌' });
            }
            const result = await UserService_1.default.verifyToken(authHeader.split(' ')[1]);
            if (!result.valid) {
                return res.status(401).json(result);
            }
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ valid: false, error: '服务器错误' });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await UserService_1.default.getALLUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async deleteUser(req, res) {
        try {
            if (!req.params.userId) {
                return res.status(401).json('Miss user id');
            }
            const userId = parseInt(req.params.userId);
            if (await UserService_1.default.deleteUser(userId)) {
                return res.status(200).json(true);
            }
            else {
                return res.status(401).json('删除用户失败');
            }
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async setAdmin(req, res) {
        try {
            if (!req.params.userId) {
                return res.status(401).json('Miss user id');
            }
            const userId = parseInt(req.params.userId);
            const user = await await UserService_1.default.setAdmin(userId);
            if (!user) {
                return res.status(401).json('设置管理员失败');
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}
exports.default = UserController;
