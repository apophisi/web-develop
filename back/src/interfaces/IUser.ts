import { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    registeredActivities: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}