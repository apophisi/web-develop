"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new AppError_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.validate = validate;
