import { User } from '../models/User';
import MongoHelpers from '../helpers/MongoHelpers';
import ResponseError from '../utils/ResponseError';

const { getConnection, useDefaultDb } = MongoHelpers;

interface IUser {
    id?: string,
    username: string,
    email: string,
    password?: string,
}

class UsersServices {
    #COLLECTION = "users";
    async createUser(username: string, email: string, password: string): Promise<IUser | void> {

        const currentUser = new User(username, email, password);
        const connection = await getConnection();
        const db = useDefaultDb(connection);

        const existingUser = await db.collection(this.#COLLECTION).findOne({ $or: [{ email: email }, { username: username }] })

        if (existingUser) {
            connection.close();
            throw new ResponseError(400, 'the user is already registered');
        }
        const userId = (await db.collection(this.#COLLECTION).insertOne(currentUser)).insertedId.toString()
        connection.close();

        return {
            id: userId,
            username,
            email
        };

    }

    async getUserByEmail(email: string): Promise<IUser | void> {

        const connection = await getConnection();
        const db = useDefaultDb(connection);
        const currentUser = await db.collection(this.#COLLECTION)
            .findOne({ email })

        connection.close();
        
        const { _id: id, username, password } = currentUser
        return {
            id,
            username,
            email,
            password
        };

    }
}
export default new UsersServices()