import mongoose from 'mongoose'
import express, {RequestHandler} from 'express'
export interface JsonError extends Error{
    statusCode?: number;
}

export interface userDocument extends mongoose.Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tasksCreated?: mongoose.Types.Array<taskDocument>;
    tasksAssigned?: mongoose.Types.Array<taskDocument>;
}

export interface taskDocument extends mongoose.Document{
    title: string;
    description: string;
    dueDate: number;
    status: string;
    createdBy: userDocument;
    assignedTo: userDocument;
    createdAt: Date;
    updatedAt: Date;
}

export interface authRequest extends express.Request{
    isAuth?: boolean;
    userId?: string | null;
}

export interface jwtObject{
    _id: string;
    email: string;
    iat: number;
    exp: number;
}

export interface newTaskType{
    title: string;
    description: string;
    dueDate: number;
    assignedTo?: string;
    createdBy: string | userDocument;
}
