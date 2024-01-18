const express = require('express');

const UsersRoutes = require('./UsersRoutes');
const TasksRoutes = require('./TasksRoutes');

const router = express.Router();

router.use(UsersRoutes);
router.use('/todos', TasksRoutes);
module.exports = router;
