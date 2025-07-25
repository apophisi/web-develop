"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const env_1 = __importDefault(require("./config/env"));
const startServer = async () => {
    await (0, config_1.testConnection)();
    app_1.default.listen(env_1.default.PORT, () => {
        console.log(`Server running on port ${env_1.default.PORT}`);
    });
};
startServer().catch(err => {
    console.error('Server startup error:', err);
    process.exit(1);
});
