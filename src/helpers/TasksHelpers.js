const fileHelpers = require('./FileHelpers');
const TaskDataFile = 'data.json';

class TasksHelpers {
    async checkTaskId(req, res, next) {
        const data = await fileHelpers.readFile(TaskDataFile);
        const TaskById = data.tasks.find(el => el.id == req.params.id);
        if (TaskById) {
            next();
        } else {
            res.status(404).send('таска с таким id не найдена');
            return;
        }
    }
};

module.exports = new TasksHelpers();