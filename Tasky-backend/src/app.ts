import express, { Request, Response, NextFunction } from 'express';
import {json} from 'body-parser';
import {JsonError} from './helpers/interfaces.module';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import mongoose from 'mongoose';

const app = express();

app.use(json());

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

app.use((err: JsonError, _req: Request, res: Response, _next: NextFunction)=>{
    if(!err.statusCode){
        err.statusCode = 500;
    }
    res.status(err.statusCode).json({message: err.message});
})

mongoose.connect(`mongodb://mongodb:27017/tasky?`)
.then(() => {
    app.listen("8080");
});


