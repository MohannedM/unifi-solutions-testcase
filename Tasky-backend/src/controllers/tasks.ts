import Task from '../models/Task';
import { RequestHandler } from 'express';
import { authRequest, taskDocument } from '../helpers/interfaces.module';
import { errorThrower } from '../helpers/helperFunctions';
import {validationResult} from 'express-validator';
import User from '../models/User';


export const createTask: RequestHandler = async (req: authRequest, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorThrower("Validation error! Please check your inputs.", 400);
        }
        if(!req.isAuth || !req.userId){
            errorThrower('Unauthorized', 401);
        }
    
        const title: string = (req.body as {title:string;}).title;
        const due_date: string = (req.body as {due_date:string;}).due_date;
        const description: string = (req.body as {description:string;}).description;
        const assigned_to: string | undefined  = (req.body as {assigned_to?:string;})?.assigned_to;

        const user = await User.findById(req.userId);
        const assignedUser = await User.findById(assigned_to);
        if(!user || !assignedUser){
            errorThrower("User not found.", 401);
            return;
        }

        const currentDate = new Date().getTime();
        if(currentDate > +due_date){
            errorThrower("Please add a future due date.", 400);
            return
        }



        const task = new Task({
            title,
            dueDate: +due_date,
            description,
            createdBy: user,
            assignedTo: assigned_to
        });
        const savedTask: taskDocument = await task.save();

        user.tasksCreated?.push(savedTask);
        assignedUser.tasksAssigned?.push(savedTask);
        await user.save();
        await assignedUser.save();

        res.status(201).json({message: "Task created successfully.", task: {
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
        }});

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
    
}

export const getTasksCreated: RequestHandler = async (req: authRequest, res, next) => {
    try{
        if(!req.isAuth || !req.userId){
            errorThrower('Unauthorized', 401);
        }

        const user = await User.findById(req.userId).populate("tasksCreated");
        if(!user){
            errorThrower("User not found.", 401);
            return;
        }

        res.status(200).json({tasks: user.tasksCreated});

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
export const getMyTasks: RequestHandler = async (req: authRequest, res, next) => {
    try{
        if(!req.isAuth || !req.userId){
            errorThrower('Unauthorized', 401);
        }

        const user = await User.findById(req.userId).populate("tasksAssigned");
        if(!user){
            errorThrower("User not found.", 401);
            return;
        }
        res.status(200).json({tasks: user.tasksAssigned});

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

export const getTask: RequestHandler = async (req: authRequest, res, next) => {
    try{
        if(!req.isAuth || !req.userId){
            errorThrower('Unauthorized', 401);
        }
        const task_id = (req.params as {task_id:string;}).task_id;
        const task = await Task.findById(task_id).populate("createdBy").populate("assignedTo");
        if(!task){
            errorThrower("Task was not found", 400);
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
        })

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

export const deleteTask: RequestHandler = async (req: authRequest, res, next) => {
    try{
        if(!req.isAuth || !req.userId){
            errorThrower('Unauthorized', 401);
            return;
        }
        const task_id = (req.params as {task_id:string;}).task_id;
        const task = await Task.findById(task_id);
        if(!task){
            errorThrower("Task was not found", 400);
            return;
        }
        if(req.userId !== task.createdBy.toString()){
            errorThrower("Forbidden", 403);
            return;
        }
        const user = await User.findById(req.userId);
        const assignedUser = await User.findById(task.assignedTo);

        if(!user || !assignedUser){
            errorThrower('User was not found.', 401);
            return;
        } 

        user.tasksCreated!.pull({_id: task._id});
        assignedUser.tasksAssigned!.pull({_id: task._id});
        await user.save();
        await assignedUser.save();
        await Task.findByIdAndDelete(task._id);

        res.status(201).json({message: "Task was deleted successfully"});
        
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}