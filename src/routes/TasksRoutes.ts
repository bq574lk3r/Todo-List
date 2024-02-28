import express from 'express';

import tasksControllers from '../controllers/TasksControllers';
import tasksHelpers from '../helpers/TasksHelpers';
import validationHelpers from '../helpers/ValidationHelpers';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();
router.use(authenticateToken);

router.use('/:id', validationHelpers.validateParamId, tasksHelpers.checkTaskId)

router.get('/', tasksControllers.getTasks)

router.post('/', validationHelpers.validateDataTask, tasksControllers.createTask);

router.patch('/:id', validationHelpers.validateTitle, tasksControllers.updateTitle)

router.patch('/:id/isCompleted', tasksControllers.updateStatus);

router.delete('/:id', tasksControllers.deleteTask);

export default router