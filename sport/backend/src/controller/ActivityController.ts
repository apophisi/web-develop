import { Request, Response } from 'express';
import ActivityService from '../service/ActivityService';


class ActivityController {
    static async getAllActivities(req: Request, res: Response) {
        try {
            const activities = await ActivityService.getAllActivities();
            res.status(200).json(activities);
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createActivity(req: Request, res: Response) {
        try {
            const activity = await ActivityService.createActivity(req.body);
            res.status(201).json(activity);
        } catch (error:any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateActivity(req: Request, res: Response) {
        try {
            if(!req.params.id){
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }

            const activity = await ActivityService.updateActivity(id, req.body);
            res.status(200).json(activity);
        } catch (error:any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteActivity(req: Request, res: Response) {
        try {
            if(!req.params.id){
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }

            const success = await ActivityService.deleteActivity(id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Activity not found' });
            }
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRegisteredActivities(req:Request, res:Response){
        try{
            const { id } = req.body;
            const registeredActivities = await ActivityService.getRegisteredActivities(id);
            return res.status(200).json(registeredActivities);
        }catch(error: any){
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    static async registerActivity(req: Request, res: Response){
        try{
            const{userId, activityId} = req.body;
            const registerActivity = await ActivityService.registerActivity(userId,activityId);
            return res.status(200).json(registerActivity);
        }catch(error:any){
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    static async cancelRegistration(req:Request, res:Response){
        try{
            const{userId , activityId} = req.body;
            const cr = await ActivityService.cancelRegistration(userId,activityId);
            return res.status(200).json(cr);
        }catch(error:any){
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    static async getById(req:Request, res:Response){
        try {
            if(!req.params.id){
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }

            const activity = await ActivityService.getById(id);
            return res.status(200).json(activity);
        }catch (error:any){
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }

    static async checkRegistration(req: Request, res: Response){
        try{
            const {userId, activityId} = req.query;

            if(!userId || !activityId){
                return res.status(400).json({message: '缺少用户ID或活动ID'});
            }

            const userIdNumber = parseInt(userId as string, 10);
            const activityIdNumber = parseInt(activityId as string, 10);

            const result = await ActivityService.checkRegistrations(userIdNumber,activityIdNumber);
            return res.status(200).json(result);

        }catch(error: any){
            console.log(error);
            res.status(401).json({error: error.message});
        }
    }
}

export default ActivityController;