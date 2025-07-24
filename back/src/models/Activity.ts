//活动模型
import { Schema, model, Document } from 'mongoose';

interface IActivity extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    maxParticipants: number;
    participants: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;
}

const activitySchema = new Schema<IActivity>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default model<IActivity>('Activity', activitySchema);