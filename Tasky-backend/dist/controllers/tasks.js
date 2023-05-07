"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = __importDefault(require("../models/Task"));
const helperFunctions_1 = require("../helpers/helperFunctions");
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
exports.createTask = async (req, res, next) => {
    var _a, _b, _c;
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            helperFunctions_1.errorThrower("Validation error! Please check your inputs.", 400);
        }
        if (!req.isAuth || !req.userId) {
            helperFunctions_1.errorThrower('Unauthorized', 401);
        }
        const title = req.body.title;
        const due_date = req.body.due_date;
        const description = req.body.description;
        const assigned_to = (_a = req.body) === null || _a === void 0 ? void 0 : _a.assigned_to;
        const user = await User_1.default.findById(req.userId);
        const assignedUser = await User_1.default.findById(assigned_to);
        if (!user || !assignedUser) {
            helperFunctions_1.errorThrower("User not found.", 401);
            return;
        }
        const currentDate = new Date().getTime();
        if (currentDate > +due_date) {
            helperFunctions_1.errorThrower("Please add a future due date.", 400);
            return;
        }
        const task = new Task_1.default({
            title,
            dueDate: +due_date,
            description,
            createdBy: user,
            assignedTo: assigned_to
        });
        const savedTask = await task.save();
        (_b = user.tasksCreated) === null || _b === void 0 ? void 0 : _b.push(savedTask);
        (_c = assignedUser.tasksAssigned) === null || _c === void 0 ? void 0 : _c.push(savedTask);
        await user.save();
        await assignedUser.save();
        res.status(201).json({ message: "Task created successfully.", task: {
                id: savedTask._id.toString(),
                title: savedTask.title,
                description: savedTask.description,
                dueDate: savedTask.dueDate,
                assignedTo: savedTask.assignedTo,
                createdBy: {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                createdAt: savedTask.createdAt.toISOString(),
                updatedAt: savedTask.updatedAt.toISOString(),
            } });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getTasksCreated = async (req, res, next) => {
    try {
        if (!req.isAuth || !req.userId) {
            helperFunctions_1.errorThrower('Unauthorized', 401);
        }
        const user = await User_1.default.findById(req.userId).populate("tasksCreated");
        if (!user) {
            helperFunctions_1.errorThrower("User not found.", 401);
            return;
        }
        res.status(200).json({ tasks: user.tasksCreated });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getMyTasks = async (req, res, next) => {
    try {
        if (!req.isAuth || !req.userId) {
            helperFunctions_1.errorThrower('Unauthorized', 401);
        }
        const user = await User_1.default.findById(req.userId).populate("tasksAssigned");
        if (!user) {
            helperFunctions_1.errorThrower("User not found.", 401);
            return;
        }
        res.status(200).json({ tasks: user.tasksAssigned });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getTask = async (req, res, next) => {
    try {
        if (!req.isAuth || !req.userId) {
            helperFunctions_1.errorThrower('Unauthorized', 401);
        }
        const task_id = req.params.task_id;
        const task = await Task_1.default.findById(task_id).populate("createdBy").populate("assignedTo");
        if (!task) {
            helperFunctions_1.errorThrower("Task was not found", 400);
            return;
        }
        res.status(200).json({
            task: {
                id: task._id.toString(),
                title: task.title,
                description: task.description,
                createdBy: {
                    id: task.createdBy._id.toString(),
                    firstName: task.createdBy.firstName,
                    lastName: task.createdBy.lastName
                },
                assignedTo: {
                    id: task.assignedTo._id.toString(),
                    firstName: task.assignedTo.firstName,
                    lastName: task.assignedTo.lastName
                },
                createdAt: task.createdAt.toISOString(),
                dueDate: task.dueDate
            }
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.deleteTask = async (req, res, next) => {
    try {
        if (!req.isAuth || !req.userId) {
            helperFunctions_1.errorThrower('Unauthorized', 401);
            return;
        }
        const task_id = req.params.task_id;
        const task = await Task_1.default.findById(task_id);
        if (!task) {
            helperFunctions_1.errorThrower("Task was not found", 400);
            return;
        }
        if (req.userId !== task.createdBy.toString()) {
            helperFunctions_1.errorThrower("Forbidden", 403);
            return;
        }
        const user = await User_1.default.findById(req.userId);
        const assignedUser = await User_1.default.findById(task.assignedTo);
        if (!user || !assignedUser) {
            helperFunctions_1.errorThrower('User was not found.', 401);
            return;
        }
        user.tasksCreated.pull({ _id: task._id });
        assignedUser.tasksAssigned.pull({ _id: task._id });
        await user.save();
        await assignedUser.save();
        await Task_1.default.findByIdAndDelete(task._id);
        res.status(201).json({ message: "Task was deleted successfully" });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
