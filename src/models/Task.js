const { v4: uuidv4 } = require('uuid');

class Task {
    constructor(title, isCompleted, idUser) {
        
        this.id = uuidv4();
        this.title = title;
        this.isCompleted = isCompleted;
        this.idUser = idUser;

    }
}

module.exports = Task;