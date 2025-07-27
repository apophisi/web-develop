import UserModel from '../models/User';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


class UserService {
    static async register(username: string, email: string, password: string, avatar:string) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(avatar);
        return UserModel.create({ username, email, password: hashedPassword, avatar});
    }

    static async login(email: string, password: string) {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(passwordMatch);
            throw new Error('密码错误');
        }

        console.log(process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return { user, token };
    }
}

export default UserService;