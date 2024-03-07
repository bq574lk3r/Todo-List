import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    tasks: {
        type: [Schema.Types.ObjectId],
        ref: 'Task'
    }
})
userSchema.index({ username: 1, email: 1 });
const User = model('User', userSchema, 'users');
export default User;