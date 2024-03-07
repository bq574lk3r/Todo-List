import User from '../models/User';

interface IUser {
    id: string,
    username: string,
    email: string,
    password?: string,
}

class UsersServices {
    async createUser(username: string, email: string, password: string): Promise<IUser | void> {
        try {
            const currentUser = new User({ username, email, password });

            await currentUser.save().catch(() => {
                throw 'the user is already registered'
            })

            return {
                id: currentUser._id.toString(),
                username,
                email
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    async getUserByEmail(email: string): Promise<IUser | void > {
        try {
            const currentUser = await User.findOne({ email }).catch(() => { throw '404' });

            if (currentUser) return {
                id: currentUser._id.toString(),
                username: currentUser.username,
                email: currentUser.email,
                password: currentUser.password
            };
        } catch (err: any) {
            throw new Error(err);
        }

    }
}

export default new UsersServices()