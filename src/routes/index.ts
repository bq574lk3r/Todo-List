import express from 'express';

import usersRoutes from './UsersRoutes';
import tasksRoutes from './TasksRoutes';

const router = express.Router();

router.use(usersRoutes);
router.use('/todos', tasksRoutes);

router.get('/', (_: any, response: any) => {
    response.redirect("/api-docs")
})

export default router;


