//活动控制器
import { Request, Response } from 'express';
import Activity from '../models/Activity';
import AppError from '../utils/AppError';

export const createActivity = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { title, description, date, location, maxParticipants } = req.body;

    const activity = await Activity.create({
        title,
        description,
        date,
        location,
        maxParticipants,
        creator: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: { activity }
    });
};


export const getActivities = async (req: Request, res: Response) => {
    const activities = await Activity.find()
        .populate('creator', 'username')
        .populate('participants', 'username');

    res.status(200).json({
        status: 'success',
        results: activities.length,
        data: {
            activities
        }
    });
};

export const joinActivity = async (req: Request, res: Response) => {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
        throw new AppError('Activity not found', 404);
    }

    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    // 检查是否已报名
    if (activity.participants.includes(req.user.id)) {
        throw new AppError('You have already joined this activity', 400);
    }

    // 检查人数限制
    if (activity.participants.length >= activity.maxParticipants) {
        throw new AppError('Activity is full', 400);
    }

    activity.participants.push(req.user.id);
    await activity.save();

    res.status(200).json({
        status: 'success',
        data: {
            activity
        }
    });
};