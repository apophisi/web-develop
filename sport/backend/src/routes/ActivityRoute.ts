import express from 'express';
import ActivityController from '../controller/ActivityController';

const router = express.Router();

router.get('/get/:id',ActivityController.getById);

router.get('/getAll', ActivityController.getAllActivities);

router.post('/create', ActivityController.createActivity);

router.put('/update/:id',ActivityController.updateActivity);

router.delete('/delete/:id', ActivityController.deleteActivity);

router.post('/registered-activities',ActivityController.getRegisteredActivities);

router.get('/check-registration', ActivityController.checkRegistration)

router.post('/register', ActivityController.registerActivity);

router.post('/cancel', ActivityController.cancelRegistration);

export default router;