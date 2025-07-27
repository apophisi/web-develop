import pool from '../config/database';

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    avatar: string;
}

class UserModel {
    static async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, image_url) VALUES (?, ?, ?, ?)',
            [user.username, user.email, user.password, user.avatar]
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
}

export default UserModel;