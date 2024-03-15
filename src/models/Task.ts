import { Schema, model } from 'mongoose';
import TransformObject from '../utils/MongooseTransformObject';
const { transformTask } = TransformObject;


const taskSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toObject: {
        showPass: true,
        versionKey: false,
        transform: transformTask
    }
}
)

taskSchema.index({ user: 1 });
const Task = model('Task', taskSchema, 'tasks');
export default Task;