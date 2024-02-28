import { User } from '../models/User';
import MongoHelpers from '../helpers/MongoHelpers';
const { getConnection, useDefaultDb } = MongoHelpers


class UsersServices {
    #COLLECTION = "users";
    async createUser(username: string, email: string, password: string): Promise<any> {
        try {
            const currentUser = new User(username, email, password);
            const connection = await getConnection();
            const db = useDefaultDb(connection);
            if (!await db.collection(this.#COLLECTION).findOne({ $or: [{ email: email }, { username: username }] })) {
                currentUser.id = (await db.collection(this.#COLLECTION).insertOne(currentUser)).insertedId
            } else {
                connection.close();
                throw 'the user is already registered';
            }
            connection.close();
            return {
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email
            };
        } catch (err: any) {
            throw new Error(err);
        }
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            const connection = await getConnection();
            const db = useDefaultDb(connection);
            const currentUser = await db.collection(this.#COLLECTION)
                .findOne({ email: email })
            connection.close();
            return {
                id: currentUser._id,
                username: currentUser.username,
                email: currentUser.email,
                password: currentUser.password
            };
        } catch (err) {
            return err;
        }

    }
}
export default new UsersServices()