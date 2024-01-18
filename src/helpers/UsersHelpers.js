const fileHelpers = require('../helpers/FileHelpers');
const userDataFile = 'data.json';

class UsersHelpers {
    async checkUserData(req, res, next) {
        const { users } = await fileHelpers.readFile(userDataFile);
        const { username, email } = req.body;
        if (!!users.find(el => el.username === username || el.email === email)) {
            res.status(400).send('пользватель с таким username или почтовым ящиком зарегестрирован');
            return;
        } else {
            next();
        }
    }
}

module.exports = new UsersHelpers()