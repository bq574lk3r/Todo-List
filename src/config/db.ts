import mongoose from 'mongoose';

const MONGO_URL = `${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_DB_NAME}`

export default async function connectDb () {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('Successful connection to MongoDb')
  } catch (err) {
    console.log(err)
  }
};