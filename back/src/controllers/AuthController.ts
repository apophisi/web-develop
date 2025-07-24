//认证控制器
import { Request, Response } from 'express';
import User from '../models/User';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await User.create({ username, email, password });
    const token = signToken({ id: user._id });

    res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user._id });
    res.json({ token });
};