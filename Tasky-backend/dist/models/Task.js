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
const taskSchema = new mongoose_1.Schema({
    title: {
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Task', taskSchema);
