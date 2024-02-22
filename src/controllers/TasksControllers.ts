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
            res.status(200).send(await tasksServices.getTasks(req.userId));
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
            const newTask = await tasksServices.createTask(title, isCompleted, req.userId);
            res.status(201).send(newTask);
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
            const updatedTask = await tasksServices.updateTitle(title, req.userId, req.params.id);
            res.status(200).send(updatedTask);
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
            const updatedTask = await tasksServices.updateStatus(req.userId, req.params.id);
            res.status(200).send(updatedTask);
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