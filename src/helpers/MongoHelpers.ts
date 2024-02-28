import { MongoClient } from "mongodb"
const mongoConnection = String(process.env.MONGO_CONNECTION_STRING);



class MongoHelpers {
    async getConnection() {
        return MongoClient.connect(mongoConnection);
    }
    useDefaultDb(connection: { db: (arg0: string | undefined) => any; }) {
        return connection.db(process.env.MONGO_DB_NAME);
    }
};

export default new MongoHelpers();