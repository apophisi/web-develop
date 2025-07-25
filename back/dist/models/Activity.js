"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//活动模型
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Activity', activitySchema);
