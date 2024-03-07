import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
taskSchema.index({ user: 1 });
const Task = model('Task', taskSchema, 'tasks');
export default Task;