import express from 'express';
import {
    createActivity,
    getActivities,
    joinActivity
} from '../controllers/ActivityController';
import {authenticate} from '../middlewares/AuthMiddle';

const router = express.Router();

// 应用JWT验证中间件
router.use(authenticate);

// GET /api/v1/activities
router.get('/', getActivities);

// POST /api/v1/activities
router.post('/', createActivity);

// POST /api/v1/activities/:id/join
router.post('/:id/join', joinActivity);

export default router;