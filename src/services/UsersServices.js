const User = require('../models/User');
const fileHelpers = require('../helpers/FileHelpers');
const userDataFile = 'data.json'

class UsersServices {
    async createUser(username, email, password) {
        try {
            const currentUser = new User(username, email, password);
            const data = await fileHelpers.readFile(userDataFile);
            data.users.push(currentUser);
            await fileHelpers.writeFile(userDataFile, data)
            return currentUser
        } catch (err) {
            return err;
        }
    }

    async getUserByEmail(email) {
        try {
            const data = await fileHelpers.readFile(userDataFile);
            return data.users.find(el => el.email == email)
        } catch (error) {
            return err;
        }

    }
}

module.exports = {
    UsersServices: new UsersServices()
}