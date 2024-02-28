import { User } from '../models/User';
import fileHelpers from '../helpers/FileHelpers';
const userDataFile = process.env.DATA || 'data.json';

class UsersServices {
    async createUser(username: string, email: string, password: string): Promise<any> {
        try {
            const data = await fileHelpers.readFile(userDataFile);
            if(data.users.find((el:any) => (el.username === username || el.username === email))){
                throw 'the user is already registered';
            }
            const currentUser = new User(username, email, password);
            data.users.push(currentUser);
            await fileHelpers.writeFile(userDataFile, data)
            return {
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email
            }
        } catch (err:any) {
             throw new Error(err);
        }
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            const data = await fileHelpers.readFile(userDataFile);
            return data.users.find((el: any): boolean => el.email == email)
        } catch (err) {
            return err;
        }

    }
}
export default new UsersServices()