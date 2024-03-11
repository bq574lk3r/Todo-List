import tasksServices from '../services/TasksServices';
import {Request, Response} from 'express';
import { validationResult } from "express-validator";
import Sentry from "@sentry/node";

interface IRequestTasks extends Request {
    userId?: string
}

class TasksControllers {

    async getTasks(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if(!req.userId){
                return res.status(400).json({ errors: 'token does not contain user ID' });
            }
            await tasksServices.getTasks(req.userId)
                .then((tasks: any) => {
                    res.status(200).send(tasks);
                })
                .catch(() => {
                    res.status(400).send({
                        errors: 'bad request'
                    });
                })
        } catch (error) {
            Sentry.captureException(error);
        }

    }

    async createTask(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if(!req.userId){
                return res.status(400).json({ errors: 'token does not contain user ID' });
            }
            const { title, isCompleted } = req.body;
            await tasksServices.createTask(title, isCompleted, req.userId)
                .then((newTask: any) => {
                    res.status(201).send(newTask);
                })
                .catch(() => {
                    res.status(400).send({
                        errors: 'error when creating task'
                    });
                });

        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async updateTitle(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if(!req.userId){
                return res.status(400).json({ errors: 'token does not contain user ID' });
            }
            const { title } = req.body;
            return await tasksServices.updateTitle(title, req.userId, req.params.id)
                .then((updatedTask) => {
                    return res.status(200).send(updatedTask)
                })
                .catch(() => {
                    return res.status(404).send({
                        errors: 'not found'
                    })
                });
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async updateStatus(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if(!req.userId){
                return res.status(400).json({ errors: 'token does not contain user ID' });
            }
            await tasksServices.updateStatus(req.userId, req.params.id)
                .then((updatedTask) => {
                    res.status(200).send(updatedTask)
                })
                .catch(() => {
                    res.status(404).send({ errors: 'not found' })
                });
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async deleteTask(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if(!req.userId){
                return res.status(400).json({ errors: 'token does not contain user ID' });
            }
            res.send(await tasksServices.deleteTask(req.userId, req.params.id));
        } catch (error) {
            Sentry.captureException(error);
        }

    }

}

export default new TasksControllers()