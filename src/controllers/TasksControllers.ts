import tasksServices from '../services/TasksServices';
import { validationResult } from "express-validator";
import Sentry from "@sentry/node";

require('dotenv').config();

class TasksControllers {

    async getTasks(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            await tasksServices.getTasks(req.userId)
                .then((tasks: any) => {
                    res.status(200).send(tasks);
                })
                .catch(() => {
                    res.status(404).send({
                        errors: 'not found'
                    });
                })
        } catch (error) {
            Sentry.captureException(error);
        }

    }

    async createTask(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
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

    async updateTitle(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
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

    async updateStatus(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
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

    async deleteTask(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            res.send(await tasksServices.deleteTask(req.userId, req.params.id));
        } catch (error) {
            Sentry.captureException(error);
        }

    }

}

export default new TasksControllers()