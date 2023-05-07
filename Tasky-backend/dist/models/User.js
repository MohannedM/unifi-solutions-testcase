"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Task'
        }],
    tasksAssigned: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: 'Task'
        }]
});
exports.default = mongoose_1.default.model('User', userSchema);
