import { Request, Response } from 'express';
import UserService from '../service/UserService';

class UserController {
    static async register(req: Request, res: Response) {
        try {
            console.log(req);
            const { username, email, password, avatar} = req.body;
            const user = await UserService.register(username, email, password, avatar);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await UserService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async verify(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ valid: false, error: '未提供认证令牌' });
            }

            const result = await UserService.verifyToken(authHeader.split(' ')[1]);

            if (!result.valid) {
                return res.status(401).json(result);
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ valid: false, error: '服务器错误' });
        }
    }

}

export default UserController;