import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import TransformObject from '../utils/MongooseTransformObject';
const { transformUser } = TransformObject;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
},
{
    toObject: {
        versionKey: false,
        transform: transformUser
    }
})
userSchema.index({ email: 1, username: 1 });
const User = model('User', userSchema, 'users');
export default User;