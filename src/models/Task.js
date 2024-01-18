const { v4: uuidv4 } = require('uuid');

class Task {
    constructor(title, isCompleted, idUser) {
        try {
            this.id = uuidv4();
            this.title = title;
            this.isCompleted = isCompleted; 
            this.idUser = idUser;
        } catch (error) {
            return error
        }
    }
}

module.exports = Task;