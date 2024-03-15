import tasksServices from '../services/TasksServices';
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import ResponceError from '../utils/ResponseError';
import ErrorHandler from '../helpers/ErrorHandlerHelpers';
interface IRequestTasks extends Request {
    userId?: string
}

class TasksControllers {

    async getTasks(req: IRequestTasks, res: Response) {
        try {

            const errors = validationResult(req);
            console.log(errors.array())
            if (!errors.isEmpty()) {
                throw new ResponceError(400, errors.array());
            }
            if (!req.userId) {
                throw new ResponceError(400, 'token does not contain user ID');
            }
            const tasks = await tasksServices.getTasks(req.userId);

            res.status(200).send(tasks);

        } catch (error: any) {
            ErrorHandler.do(error, res)
        }

    }

    async createTask(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponceError(400, errors.array());
            }
            if (!req.userId) {
                throw new ResponceError(400, 'token does not contain user ID');
            }
            const { title, isCompleted } = req.body;

            const newTask = await tasksServices.createTask(title, isCompleted, req.userId)

            res.status(201).send(newTask);

        } catch (error: any) {
            ErrorHandler.do(error, res)
        }
    }

    async updateTitle(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponceError(400, errors.array());
            }
            if (!req.userId) {
                throw new ResponceError(400, 'token does not contain user ID');
            }
            const { title } = req.body;

            const updatedTask = await tasksServices.updateTitle(title, req.userId, req.params.id);

            res.status(200).send(updatedTask);

        } catch (error: any) {

            ErrorHandler.do(error, res)

        }
    }

    async updateStatus(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponceError(400, errors.array());
            }
            if (!req.userId) {
                throw new ResponceError(400, 'token does not contain user ID');
            }
            const updatedTask = await tasksServices.updateStatus(req.userId, req.params.id);

            res.status(200).send(updatedTask);

        } catch (error: any) {
            ErrorHandler.do(error, res)
        }
    }

    async deleteTask(req: IRequestTasks, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ResponceError(400, errors.array());
            }
            if (!req.userId) {
                throw new ResponceError(400, 'token does not contain user ID');
            }
            const isDeleted = await tasksServices.deleteTask(req.userId, req.params.id);

            res.send(isDeleted);
        } catch (error: any) {
            ErrorHandler.do(error, res)
        }

    }

}

export default new TasksControllers()