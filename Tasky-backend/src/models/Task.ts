import mongoose, {Schema} from 'mongoose';
import {taskDocument} from '../helpers/interfaces.module';

const taskSchema = new Schema({
    title:{
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    dueDate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Open'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

export default mongoose.model<taskDocument>('Task', taskSchema);