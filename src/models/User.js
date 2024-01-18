const { v4: uuidv4 } = require('uuid');

class User {
    constructor(username, email, password) {
        try {
            this.id = uuidv4();
            this.username = username;
            this.email = email;
            this.password = password;
        } catch (error) {
            return error
        }
    }
}

module.exports = User;