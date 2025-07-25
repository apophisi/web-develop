"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const ActivityRoute_1 = __importDefault(require("./routes/ActivityRoute"));
const Error_1 = require("./middlewares/Error");
require("./types/express");
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// 路由
app.use('/api/v1/auth', AuthRoute_1.default);
app.use('/api/v1/activities', ActivityRoute_1.default);
// 错误处理
app.use(Error_1.errorHandler);
exports.default = app;
