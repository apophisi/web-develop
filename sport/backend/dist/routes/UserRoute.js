"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controller/UserController"));
const router = (0, express_1.Router)();
router.post('/register', UserController_1.default.register);
router.post('/login', UserController_1.default.login);
router.get('/verify', UserController_1.default.verify);
router.get('/get', UserController_1.default.getAllUsers);
router.delete(`/delete/:userId`, UserController_1.default.deleteUser);
router.post('/set-admin/:userId', UserController_1.default.setAdmin);
exports.default = router;
