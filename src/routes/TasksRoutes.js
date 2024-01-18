const express = require('express');
const router = express.Router();
const TasksControllers = require('../controllers/TasksControllers');
const TasksHelpers = require('../helpers/TasksHelpers')
const ValidationHelpers = require('../helpers/ValidationHelpers');
const authenticateToken = require('../middleware/authenticateToken')

router.use(authenticateToken);

router.use('/:id', ValidationHelpers.validateParamId, TasksHelpers.checkTaskId)

router.get('/', TasksControllers.getTasks)

router.post('/', ValidationHelpers.validateDataTask, TasksControllers.createTask);

router.patch('/:id', ValidationHelpers.validateTitle, TasksControllers.updateTitle)

router.patch('/:id/isCompleted', TasksControllers.updateStatus);

router.delete('/:id', TasksControllers.deleteTask);

module.exports = router;