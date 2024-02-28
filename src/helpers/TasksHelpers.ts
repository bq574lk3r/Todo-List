import fileHelpers from './FileHelpers';
const TaskDataFile = process.env.DATA || 'data.json';

class TasksHelpers {
    async checkTaskId(req:any, res:any, next:any):Promise<void> {
        const data = await fileHelpers.readFile(TaskDataFile);
        const TaskById = data.tasks.find((el:any) => el.id == req.params.id);
        if (TaskById) {
            next();
        } else {
            res.status(404).send('таска с таким id не найдена');
            return;
        }
    }
};

export default new TasksHelpers();