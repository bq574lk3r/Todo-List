import { Task } from '../models/Task';
import MongoHelpers from '../helpers/MongoHelpers';
import { ObjectId } from 'mongodb'

const { getConnection, useDefaultDb } = MongoHelpers

export class TasksServices {
    #COLLECTION_TASKS = 'tasks';
    #COLLECTION_USERS = 'users';
    async getTasks(idUser: string): Promise<any> {
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
            if (!tasks) {
                throw new Error('404')
            }
            return tasks;
        } catch (error) {
            throw new Error('404');
        }
    }
    
    async createTask(title: string, isCompleted: boolean, idUser: string): Promise<any> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);
            
            const currentTask = new Task(title, isCompleted, new ObjectId(idUser));

            const idTask = (await db.collection(this.#COLLECTION_TASKS)
                .insertOne(currentTask)).insertedId;

            await db.collection(this.#COLLECTION_USERS)
                .updateOne({ _id: new ObjectId(idUser) }, { $push: { tasks: idTask } })

            connection.close();
            return {
                id: idTask.toString(),
                idUser: currentTask._idUser,
                isCompleted: currentTask.isCompleted,
                title: currentTask.title
            };
        } catch (err) {
            return "ошибка при создании таски"
        }
    }

    async updateTitle(title: string, idUser: string, idTask: string): Promise<any> {
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

            return {
                id: taskById._id,
                idUser: taskById._idUser,
                title: taskById.title,
                isCompleted: taskById.isCompleted
            };

        } catch (err: any) {
            throw new Error(err)
        }
    }

    async updateStatus(idUser: any, idTask: any): Promise<any> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);

            const taskById = await db.collection(this.#COLLECTION_TASKS)
                .findOneAndUpdate(
                    { _id: new ObjectId(idTask) },
                    [{
                        $set: {
                            isCompleted: {
                                $not: "$isCompleted"
                            }
                        }
                    }],
                    {
                        returnDocument: "after"
                    })

            connection.close();

            if (!taskById) {
                throw new Error('404')
            }

            return {
                id: taskById._id,
                idUser: taskById._idUser,
                title: taskById.title,
                isCompleted: taskById.isCompleted
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
            return 'ошибка при удалении таски';
        }

    }
}

export default new TasksServices()