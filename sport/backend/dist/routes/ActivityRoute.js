"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ActivityController_1 = __importDefault(require("../controller/ActivityController"));
const router = express_1.default.Router();
router.get('/get/:id', ActivityController_1.default.getById);
router.get('/getAll', ActivityController_1.default.getAllActivities);
router.post('/create', ActivityController_1.default.createActivity);
router.put('/update/:id', ActivityController_1.default.updateActivity);
router.delete('/delete/:id', ActivityController_1.default.deleteActivity);
router.post('/registered-activities', ActivityController_1.default.getRegisteredActivities);
router.get('/check-registration', ActivityController_1.default.checkRegistration);
router.post('/register', ActivityController_1.default.registerActivity);
router.post('/cancel', ActivityController_1.default.cancelRegistration);
exports.default = router;
