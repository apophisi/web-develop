"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActivityService_1 = __importDefault(require("../service/ActivityService"));
class ActivityController {
    static async getAllActivities(req, res) {
        try {
            const activities = await ActivityService_1.default.getAllActivities();
            res.status(200).json(activities);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async createActivity(req, res) {
        try {
            const activity = await ActivityService_1.default.createActivity(req.body);
            res.status(201).json(activity);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateActivity(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const activity = await ActivityService_1.default.updateActivity(id, req.body);
            res.status(200).json(activity);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteActivity(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const success = await ActivityService_1.default.deleteActivity(id);
            if (success) {
                res.status(204).send();
            }
            else {
                res.status(404).json({ error: 'Activity not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getRegisteredActivities(req, res) {
        try {
            const { id } = req.body;
            const registeredActivities = await ActivityService_1.default.getRegisteredActivities(id);
            return res.status(200).json(registeredActivities);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async registerActivity(req, res) {
        try {
            const { userId, activityId } = req.body;
            const registerActivity = await ActivityService_1.default.registerActivity(userId, activityId);
            return res.status(200).json(registerActivity);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async cancelRegistration(req, res) {
        try {
            const { userId, activityId } = req.body;
            const cr = await ActivityService_1.default.cancelRegistration(userId, activityId);
            return res.status(200).json(cr);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const activity = await ActivityService_1.default.getById(id);
            return res.status(200).json(activity);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
    static async checkRegistration(req, res) {
        try {
            const { userId, activityId } = req.query;
            if (!userId || !activityId) {
                return res.status(400).json({ message: '缺少用户ID或活动ID' });
            }
            const userIdNumber = parseInt(userId, 10);
            const activityIdNumber = parseInt(activityId, 10);
            const result = await ActivityService_1.default.checkRegistrations(userIdNumber, activityIdNumber);
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ error: error.message });
        }
    }
}
exports.default = ActivityController;
