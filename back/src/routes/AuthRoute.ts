import express from 'express';
import { register, login } from '../controllers/AuthController';
import {validate} from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/AuthValidation';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

export default router;