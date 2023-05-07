import mongoose, {Schema} from 'mongoose';
import {userDocument} from '../helpers/interfaces.module'

const userSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    tasksCreated: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    }],
    tasksAssigned: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    }]
});


export default mongoose.model<userDocument>('User', userSchema);
