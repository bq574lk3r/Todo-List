import Task from '../models/Task';
import ResponseError from '../utils/ResponseError';
import { ObjectId } from 'mongodb'


interface ITask {
    id: ObjectId,
    isCompleted: boolean,
    title: string,
}

export class TasksServices {
    async getTasks(idUser: string): Promise<Array<ITask> | void> {
        const tasks = await Task.aggregate([
            { $match: { user: new ObjectId(idUser) } },
            { $project: { id: "$_id", isCompleted: 1, title: 1, _id: 0 } },
            { $sort: { isCompleted: 1, _id: -1 } } //1 and -1
        ]);

        return tasks;
    }

    async createTask(title: string, isCompleted: boolean, idUser: string): Promise<ITask | void> {
        const currentTask = new Task({ title, isCompleted, user: idUser })
        await currentTask.save()

        return currentTask.toObject();
    }

    async updateTitle(titleNew: string, idUser: string, idTask: string): Promise<ITask | void> {

        const taskById = await Task
            .findByIdAndUpdate(idTask, { $set: { title: titleNew } }, { returnDocument: "after" });

        if (!taskById) {
            throw new ResponseError(404)
        }

        return taskById.toObject();

    }

    async updateStatus(idUser: string, idTask: string): Promise<ITask | void> {
        const taskById = await Task
            .findByIdAndUpdate(
                idTask,
                [{ $set: { isCompleted: { $not: ["$isCompleted"] } } }],
                { returnDocument: "after" }
            );

        if (!taskById) {
            throw new ResponseError(404)
        }

        return taskById.toObject();

    }

    async deleteTask(idUser: string, idTask: string): Promise<string | void> {

        const taskById = await Task
            .findByIdAndDelete(idTask);
        if (!taskById) {
            throw new ResponseError(404)
        }

        return 'deleted';

    }
}

export default new TasksServices()