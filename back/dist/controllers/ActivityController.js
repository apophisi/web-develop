"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinActivity = exports.getActivities = exports.createActivity = void 0;
const Activity_1 = __importDefault(require("../models/Activity"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createActivity = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
    const { title, description, date, location, maxParticipants } = req.body;
    const activity = await Activity_1.default.create({
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
exports.createActivity = createActivity;
const getActivities = async (req, res) => {
    const activities = await Activity_1.default.find()
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
exports.getActivities = getActivities;
const joinActivity = async (req, res) => {
    const activity = await Activity_1.default.findById(req.params.id);
    if (!activity) {
        throw new AppError_1.default('Activity not found', 404);
    }
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
    // 检查是否已报名
    if (activity.participants.includes(req.user.id)) {
        throw new AppError_1.default('You have already joined this activity', 400);
    }
    // 检查人数限制
    if (activity.participants.length >= activity.maxParticipants) {
        throw new AppError_1.default('Activity is full', 400);
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
exports.joinActivity = joinActivity;
