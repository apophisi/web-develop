import ActivityModel from '../models/Activity';

class ActivityService {
    static async getAllActivities(): Promise<any[]> {
        try {
            return await ActivityModel.findAll();
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw new Error('Failed to fetch activities');
        }
    }

    static async createActivity(activityData: any): Promise<any> {
        try {
            return await ActivityModel.create(activityData);
        } catch (error) {
            console.error('Error creating activity:', error);
            throw new Error('Failed to create activity');
        }
    }

    static async updateActivity(id: number, activityData: any): Promise<any> {
        try {
            const updated = await ActivityModel.update(id, activityData);
            if (!updated) {
                throw new Error('Activity not found');
            }
            return updated;
        } catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    }

    static async deleteActivity(id: number): Promise<boolean> {
        try {
            return await ActivityModel.delete(id);
        } catch (error) {
            console.error('Error deleting activity:', error);
            throw new Error('Failed to delete activity');
        }
    }

    static async getRegisteredActivities(id: number) {
        try{
            return await ActivityModel.getRegisteredActivities(id);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    static async registerActivity(user_id:number, activity_id:number){
        try{
            return await ActivityModel.registerActivity({user_id,activity_id})
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    static async cancelRegistration(userId:number, activityId:number){
        try{
            return await ActivityModel.cancelRegistration(userId,activityId);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    static async getById(id:number){
        try {
            return await ActivityModel.findById(id);
        }catch (error){
            console.log(error);
            throw error;
        }
    }

    static async checkRegistrations(userId:number, activityId: number){
        try{
            return await ActivityModel.checkRegistration(userId,activityId);
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}

export default ActivityService;