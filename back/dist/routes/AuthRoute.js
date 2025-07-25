"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const validate_1 = require("../middlewares/validate");
const AuthValidation_1 = require("../validations/AuthValidation");
const router = express_1.default.Router();
// POST /api/v1/auth/register
router.post('/register', (0, validate_1.validate)(AuthValidation_1.registerSchema), AuthController_1.register);
// POST /api/v1/auth/login
router.post('/login', (0, validate_1.validate)(AuthValidation_1.loginSchema), AuthController_1.login);
exports.default = router;
