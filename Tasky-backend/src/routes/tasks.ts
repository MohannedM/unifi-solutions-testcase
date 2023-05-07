import {Router} from 'express';
import {check} from 'express-validator';
import isAuth from '../middlewares/is-auth';
import * as tasksController from '../controllers/tasks';

const router = Router();

router.post("/", [
    check('title').trim().isLength({min: 5, max: 50}),
    check('description').trim().isLength({min: 20, max: 250}),
    check('due_date').trim().isLength({min: 3, max: 25}),
    check('assigned_to').trim().isLength({min: 1, max: 50})
], isAuth, tasksController.createTask);

router.get("/created", isAuth, tasksController.getTasksCreated);

router.get("/assigned", isAuth, tasksController.getMyTasks);

router.get("/:task_id", isAuth, tasksController.getTask);

router.delete("/:task_id", isAuth, tasksController.deleteTask);


export default router;