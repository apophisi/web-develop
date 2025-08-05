"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Activity_1 = __importDefault(require("../models/Activity"));
class ActivityService {
    static async getAllActivities() {
        try {
            return await Activity_1.default.findAll();
        }
        catch (error) {
            console.error('Error fetching activities:', error);
            throw new Error('Failed to fetch activities');
        }
    }
    static async createActivity(activityData) {
        try {
            return await Activity_1.default.create(activityData);
        }
        catch (error) {
            console.error('Error creating activity:', error);
            throw new Error('Failed to create activity');
        }
    }
    static async updateActivity(id, activityData) {
        try {
            const updated = await Activity_1.default.update(id, activityData);
            if (!updated) {
                throw new Error('Activity not found');
            }
            return updated;
        }
        catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    }
    static async deleteActivity(id) {
        try {
            return await Activity_1.default.delete(id);
        }
        catch (error) {
            console.error('Error deleting activity:', error);
            throw new Error('Failed to delete activity');
        }
    }
    static async getRegisteredActivities(id) {
        try {
            return await Activity_1.default.getRegisteredActivities(id);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async registerActivity(user_id, activity_id) {
        try {
            return await Activity_1.default.registerActivity({ user_id, activity_id });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async cancelRegistration(userId, activityId) {
        try {
            return await Activity_1.default.cancelRegistration(userId, activityId);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async getById(id) {
        try {
            return await Activity_1.default.findById(id);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async checkRegistrations(userId, activityId) {
        try {
            return await Activity_1.default.checkRegistration(userId, activityId);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}
exports.default = ActivityService;
