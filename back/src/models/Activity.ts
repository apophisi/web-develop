import pool from '../config/database';

interface Activity {
    id: number;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    location: string;
    max_participants: number;
    current_participants: number;
    created_by: number;
    created_at: Date;
}

class ActivityModel {
    static async create(activity: Omit<Activity, 'id' | 'created_at' | 'current_participants'>): Promise<Activity> {
        const [result] = await pool.query(
            'INSERT INTO activities (title, description, start_time, end_time, location, max_participants, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [activity.title, activity.description, activity.start_time, activity.end_time, activity.location, activity.max_participants, activity.created_by]
        );

        const insertActivity = await this.findById((result as any).insertId)
        if (!insertActivity){
            throw new Error('fail to create new activity')
        }
        return insertActivity;
    }

    static async findById(id: number): Promise<Activity | null> {
        const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
        return (rows as Activity[])[0] || null;
    }

    static async findAll(): Promise<Activity[]> {
        const [rows] = await pool.query('SELECT * FROM activities');
        return rows as Activity[];
    }

    static async search(keyword: string): Promise<Activity[]> {
        const [rows] = await pool.query(
            'SELECT * FROM activities WHERE title LIKE ? OR description LIKE ? OR location LIKE ?',
            [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
        );
        return rows as Activity[];
    }

    static async updateParticipants(id: number, increment: boolean): Promise<void> {
        const operation = increment ? '+' : '-';
        await pool.query(
            `UPDATE activities SET current_participants = current_participants ${operation} 1 WHERE id = ?`,
            [id]
        );
    }
}

export default ActivityModel;