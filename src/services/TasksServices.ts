import { Task } from '../models/Task';
import fileHelpers from '../helpers/FileHelpers';
const taskDataFile = process.env.DATA || 'data.json';

export class TasksServices {
    async getTasks(idUser: any):Promise<any> {
        try {
            const data = await fileHelpers.readFile(taskDataFile);
            return data.tasks.filter((tasks:any) => tasks.idUser === idUser);
        } catch (error) {
            return "ошибка при получении таск"
        }

    }

    async createTask(title: any, isCompleted: any, idUser: any):Promise<any> {
        try {
            const currentTask = new Task(title, isCompleted, idUser);
            const data = await fileHelpers.readFile(taskDataFile);
            data.tasks.push(currentTask);
            await fileHelpers.writeFile(taskDataFile, data);
            return currentTask;
        } catch (err) {
            return "ошибка при создании таски"
        }
    }

    async updateTitle(title: any, idUser: any, idTask: any):Promise<any> {
        try {
            const data = await fileHelpers.readFile(taskDataFile);

            const taskById = data.tasks.find((el: any) => el.idUser == idUser && el.id === idTask);
            if (!taskById) {
                throw new Error('у данного пользователя нет такой таски')
            }
            taskById.title = title;
            await fileHelpers.writeFile(taskDataFile, data);
            return taskById;

        } catch (err: any) {
            return err.message
        }
    }

    async updateStatus(idUser: any, idTask: any):Promise<any> {
        try {
            const data = await fileHelpers.readFile(taskDataFile);

            const taskById = data.tasks.find((el: any) => el.idUser == idUser && el.id === idTask);
            taskById.isCompleted = !taskById.isCompleted;
            await fileHelpers.writeFile(taskDataFile, data);
            return taskById;

        } catch (err) {
            return "ошибка при обновлении статуса таски"
        }
    }

    async deleteTask(idUser: string, idTask: string):Promise<any> {
        try {
            const data = await fileHelpers.readFile(taskDataFile);
            const taskIndex = data.tasks.findIndex((el: any) => el.idUser == idUser && el.id === idTask);
            data.tasks.splice(taskIndex, 1);
            await fileHelpers.writeFile(taskDataFile, data);
            return 'deleted'
        } catch (err) {
            return 'ошибка при удалении таски';
        }

    }
}

export default new TasksServices()