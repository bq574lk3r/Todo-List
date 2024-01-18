const Task = require('../models/Task');

const fileHelpers = require('../helpers/FileHelpers');
const taskDataFile = 'data.json';

class TasksServices {
    async getTasks(idUser) {
        try {
            const data = await fileHelpers.readFile(taskDataFile);
            return data.tasks.filter(tasks => tasks.idUser === idUser);
        } catch (error) {
            return "ошибка при получении таск"
        }

    }

    async createTask(title, isCompleted, idUser) {
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

    async updateTitle(title, idUser, idTask) {
        try {
            const data = await fileHelpers.readFile(taskDataFile);

            const taskById = data.tasks.find(el => el.idUser == idUser && el.id === idTask);
            if (!taskById){
                throw new Error('у данного пользователя нет такой таски')
            }
            taskById.title = title;
            await fileHelpers.writeFile(taskDataFile, data);
            return taskById;

        } catch (err) {
            return err.message
        }
    }

    async updateStatus(idUser, idTask) {
        try {
            const data = await fileHelpers.readFile(taskDataFile);

            const taskById = data.tasks.find(el => el.idUser == idUser && el.id === idTask);
            taskById.isCompleted = !taskById.isCompleted;
            await fileHelpers.writeFile(taskDataFile, data);
            return taskById;

        } catch (err) {
            return "ошибка при обновлении статуса таски"
        }
    }

    async deleteTask(idUser, idTask) {
        try {
            const data = await fileHelpers.readFile(taskDataFile);
            const taskIndex = data.tasks.findIndex(el => el.idUser == idUser && el.id === idTask);
            data.tasks.splice(taskIndex, 1);
            await fileHelpers.writeFile(taskDataFile, data);
            return 'deleted'
        } catch (err) {
            return 'ошибка при удалении таски';
        }

    }
}

module.exports = {
    TasksServices: new TasksServices()
}