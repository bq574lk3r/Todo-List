import express, {Request, Response} from 'express';

import usersRoutes from './UsersRoutes';
import tasksRoutes from './TasksRoutes';

const router = express.Router();

router.use(usersRoutes);
router.use('/todos', tasksRoutes);

router.get('/', (_: Request, res: Response) => {
    res.redirect("/api-docs")
})

export default router;


