import pool from '../config/database';
import ActivityModel from "./Activity";

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    avatar: string;
    enum: number;
}

interface UserManageMessage{
    id:number;
    username: string;
    email:string;
    enum:number;
    created_at: Date;
}

class UserModel {
    static async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, image_url, enum) VALUES (?, ?, ?, ?, ?)',
            [user.username, user.email, user.password, user.avatar, user.enum]
        );

        const insertedUser = await this.findById((result as any).insertId);
        if (!insertedUser) {
            throw new Error('Failed to create user');
        }
        return insertedUser;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return (rows as User[])[0] || null;
    }

    static async findById(id: number): Promise<User | null> {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return (rows as User[])[0] || null;
    }

    static async findMessageById(id: number): Promise<UserManageMessage | null> {
        const [rows] = await pool.query('SELECT users.id, users.username, users.email, users.enum, users.created_at FROM users WHERE id = ?', [id]);
        return (rows as UserManageMessage[])[0] || null;
    }

    static async findAll(): Promise<UserManageMessage[] | null>{
        const [rows] = await pool.query('SELECT users.id, users.username, users.email, users.enum, users.created_at FROM users');
        return rows as UserManageMessage[];
    }

    static async delete(id: number):Promise<boolean>{
        const [activityIds] = await pool.query(
            'SELECT activity_id FROM activity_registrations WHERE user_id = ?',
            [id]
        ) as any;

        for (const { activity_id } of activityIds) {
            await pool.query(
                'UPDATE activities SET registered_count = registered_count - 1 WHERE id = ?',
                [activity_id]
            );
        }
        await  pool.query('DELETE FROM activity_registrations where user_id = ?',[id])
        const [rows] = await pool.query('DELETE FROM users WHERE id = ?',[id]);
        return (rows as any).affectedRows > 0;
    }

    static async setAdmin(id:number):Promise<UserManageMessage | null>{
        const [rows] = await pool.query('UPDATE users SET enum = 1 WHERE id = ?', [id]);
        if((rows as any).affectedRows > 0){
            return await this.findMessageById(id);
        }
        return null;
    }
}

export default UserModel;