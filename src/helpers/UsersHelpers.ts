import fileHelpers from '../helpers/FileHelpers';
const userDataFile = 'data.json';

export class UsersHelpers {
    async checkUserData(req:any, res:any, next:any): Promise<any> {
        const { users } = await fileHelpers.readFile(userDataFile);
        const { username, email } = req.body;
        if (!!users.find((el:any) => el.username === username || el.email === email)) {
            res.status(400).send({ message: 'пользователь с таким username или почтовым ящиком уже зарегистрирован' });
            return;
        } else {
            next();
        }
    }
}


export default new UsersHelpers()