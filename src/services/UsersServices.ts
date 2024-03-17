import User from '../models/User';
import ResponseError from '../utils/ResponseError';
import { ObjectId } from 'mongodb'

interface IUser {
    id: ObjectId,
    username: string,
    email: string,
    password?: string,
}
class UsersServices {
    async createUser(username: string, email: string, password: string): Promise<IUser | void> {

        const currentUser = new User({ username, email, password });

        try { 
            await currentUser.save() 
        } catch (error) { 
            throw new ResponseError(400, "the user is already registered") 
        }

        const { password: skipPass, _id: id, ...result } = currentUser.toObject();
        return { id, ...result };
    }

    async getUserByEmail(email: string): Promise<IUser | void> {

        const currentUser = await User.findOne({ email })

        if (currentUser) return currentUser.toObject();

    }
}

export default new UsersServices()