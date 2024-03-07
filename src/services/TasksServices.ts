import Task from '../models/Task';
import { ObjectId } from 'mongodb'

interface ITask {
    id: string,
    isCompleted: boolean,
    title: string,
    idUser?: string,
}

export class TasksServices {
    async getTasks(idUser: string): Promise<Array<ITask> | void> {
        try {
            const tasks = await Task.aggregate([
                { $match: { user: new ObjectId(idUser) } },
                { $project: { id: "$_id", isCompleted: 1, title: 1, _id: 0 } },
                { $sort: { isCompleted: 1, _id: -1 } } //1 and -1
            ]);

            return tasks;
        } catch (err: any) {
            throw new Error(err);
        }
    }

    async createTask(title: string, isCompleted: boolean, idUser: string): Promise<ITask | void> {
        try {
            const currentTask = new Task({ title, isCompleted, user: idUser })
            await currentTask.save().catch(() => {
                throw 'error when saving'
            })
            
            return {
                id: currentTask._id.toString(),
                title,
                isCompleted,
                idUser,
            };
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async updateTitle(titleNew: string, idUser: string, idTask: string): Promise<ITask | void> {
        try {
            const taskById = await Task
                .findByIdAndUpdate(idTask, { $set: { title: titleNew } }, { returnDocument: "after" });

            if (!taskById) {
                throw new Error('404')
            }

            const { _id: id, title, isCompleted } = taskById;

            return {
                id: id.toString(),
                idUser,
                title,
                isCompleted
            };

        } catch (err: any) {
            throw new Error(err)
        }
    }

    async updateStatus(idUser: string, idTask: string): Promise<ITask | void> {
        try {
            const taskById = await Task
                .findByIdAndUpdate(
                    idTask,
                    [{ $set: { isCompleted: { $not: ["$isCompleted"] } } }],
                    { returnDocument: "after" }
                );


            if (!taskById) {
                throw new Error('404')
            }

            const { _id: id, title, isCompleted } = taskById;


            return {
                id: id.toString(),
                title,
                isCompleted,
                idUser

            };

        } catch (err: any) {
            throw new Error(err);
        }
    }

    async deleteTask(idUser: string, idTask: string): Promise<string | void> {
        try {

            const taskById = await Task
                .findByIdAndDelete(idTask);
            if (!taskById) {
                throw new Error('404')
            }

            return 'deleted'
        } catch (err: any) {
            throw new Error(err);
        }

    }
}

export default new TasksServices()