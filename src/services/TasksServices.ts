import { Task } from '../models/Task';
import MongoHelpers from '../helpers/MongoHelpers';
import { ObjectId } from 'mongodb'

const { getConnection, useDefaultDb } = MongoHelpers

interface ITask {
    id: string,
    isCompleted: boolean,
    title: string,
    idUser?: string,
}

export class TasksServices {
    #COLLECTION_TASKS = 'tasks';
    #COLLECTION_USERS = 'users';
    async getTasks(idUser: string): Promise<Array<ITask> | void> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);

            const tasks = await db.collection(this.#COLLECTION_TASKS)
                .find({
                    _idUser: new ObjectId(idUser)
                })
                .project({ '_idUser': 0 }).sort({ isCompleted: 1, _id: 1 })
                .toArray();
            connection.close();

            return tasks;
        } catch (err) {
            throw err;
        }
    }

    async createTask(title: string, isCompleted: boolean, idUser: string): Promise<ITask | void> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);

            const currentTask = new Task(title, isCompleted, new ObjectId(idUser));

            const idTask = (await db.collection(this.#COLLECTION_TASKS)
                .insertOne(currentTask)).insertedId.toString();

            connection.close();

            return {
                id: idTask,
                idUser,
                isCompleted,
                title
            };
        } catch (err) {
            throw err
        }
    }

    async updateTitle(title: string, idUser: string, idTask: string): Promise<ITask | void> {
        try {

            const connection = await getConnection();
            const db = useDefaultDb(connection);
            const taskById = await db.collection(this.#COLLECTION_TASKS)
                .findOneAndUpdate({ _id: new ObjectId(idTask) }, { $set: { title } }, {
                    returnDocument: "after"
                })
            connection.close();

            if (!taskById) {
                throw new Error('404')
            }
            const { _id: id, isCompleted } = taskById
            return {
                id,
                idUser,
                title,
                isCompleted
            };

        } catch (err: any) {
            throw err
        }
    }

    async updateStatus(idUser: string, idTask: string): Promise<ITask | void> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);

            const taskById = await db.collection(this.#COLLECTION_TASKS)
                .findOneAndUpdate(
                    { _id: new ObjectId(idTask) },
                    [{ $set: { isCompleted: { $not: "$isCompleted" } } }],
                    { returnDocument: "after" })

            connection.close();

            if (!taskById) {
                throw new Error('404')
            }
            const { _id: id, title, isCompleted } = taskById
            return {
                id,
                idUser,
                title,
                isCompleted
            };

        } catch (err: any) {
            throw new Error(err);
        }
    }

    async deleteTask(idUser: string, idTask: string): Promise<any> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);

            await db.collection(this.#COLLECTION_TASKS)
                .findOneAndDelete({
                    _id: new ObjectId(idTask)
                })
            await db.collection(this.#COLLECTION_USERS)
                .updateOne({ _id: new ObjectId(idUser) }, { $pull: { tasks: new ObjectId(idTask) } })
            connection.close();

            return 'deleted'
        } catch (err) {
            throw err;
        }

    }
}

export default new TasksServices()