import pool from '../config/database';

interface Activity {
    id: number;
    title: string;
    description: string;
    date: Date;
    location: string;
    participants: number;
    registered_count:number;
    image: string;
    created_at: Date;
    updated_at: Date;
}

interface ActivityRegistration{
    id: number;
    user_id:number;
    activity_id:number;
    created_at:Date;
}

class ActivityModel {
    static async create(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Promise<Activity> {
        const [rows] = await pool.query(
            'INSERT INTO activities (title, description, date, location, participants, image) VALUES (?, ?, ?, ?, ?, ?)',
            [activity.title, activity.description, activity.date, activity.location, activity.participants, activity.image]
        );

        const insertedActivity = await this.findById((rows as any).insertId);
        if (!insertedActivity) {
            throw new Error('Failed to create activity');
        }
        return insertedActivity;
    }

    static async findById(id: number): Promise<Activity | null> {
        const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
        return (rows as Activity[])[0] || null;
    }

    static async findAll(): Promise<Activity[]> {
        const [rows] = await pool.query('SELECT * FROM activities ORDER BY date DESC');
        return rows as Activity[];
    }

    static async update(id: number, activity: Partial<Activity>): Promise<Activity | null> {
        const [rows] = await pool.query(
            'UPDATE activities SET title = ?, description = ?, date = ?, location = ?, participants = ?, image = ? WHERE id = ?',
            [activity.title, activity.description, activity.date, activity.location, activity.participants, activity.image, id]
        );

        if ((rows as any).affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }

    static async delete(id: number): Promise<boolean> {
        await pool.query('DELETE FROM activity_registrations where activity_id = ?', [id]);
        await pool.query('DELETE FROM comments where activity_id = ?', [id]);
        const [rows] = await pool.query('DELETE FROM activities WHERE id = ?', [id]);
        return (rows as any).affectedRows > 0;
    }

    static async getRegisteredActivities(id : number):Promise<Activity[] | null>{
        const [rows] = await pool.query(`
                SELECT a.* FROM activities a
                JOIN activity_registrations ar ON a.id = ar.activity_id
                WHERE ar.user_id = ?
                ORDER BY a.date DESC
            `, [id]);
        return (rows as Activity[]) || null;
    }

    static async registerActivity(ar:Omit<ActivityRegistration,'id' | 'created_at'>):Promise<boolean>{
        const activity = await this.findById(ar.activity_id);
        if(!activity || activity.registered_count >= activity.participants) {
            console.log('1')
            return false;
        }

        const [existing] = await pool.query(
            'SELECT * FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
            [ar.user_id, ar.activity_id]
        );

        if(!((existing as any).length === 0)){
            console.log(existing);
            return false;
        }

        await pool.query('START TRANSACTION');

        try {
            // 添加报名记录
            await pool.query(
                'INSERT INTO activity_registrations (user_id, activity_id) VALUES (?, ?)',
                [ar.user_id, ar.activity_id]
            );

            // 更新活动报名人数
            await pool.query(
                'UPDATE activities SET registered_count = registered_count + 1 WHERE id = ?',
                [ar.activity_id]
            );

            await pool.query('COMMIT');

        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }

        return true;
    }

    static async cancelRegistration(userId:number, activityId:number):Promise<boolean>{
        const [existing] = await pool.query(
            'SELECT * FROM activity_registrations WHERE user_id = ? AND activity_id = ? FOR UPDATE',
            [userId, activityId]
        );

        if((existing as any).length === 0) return false;

        await pool.query(
            'DELETE FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
            [userId, activityId]
        );

        await pool.query(
            'UPDATE activities SET registered_count = registered_count - 1 WHERE id = ?',
            [activityId]
        );

        return true;
    }

    static async checkRegistration(userId:number, activityId:number):Promise<boolean>{
        const [existing] = await pool.query(
            'SELECT * FROM activity_registrations WHERE user_id = ? AND  activity_id = ? FOR UPDATE',
            [userId, activityId]
        );

        return (existing as any).length !== 0;
    }
}

export default ActivityModel;