import {Router} from 'express';
import {check} from 'express-validator';
import * as authControllers from '../controllers/auth';
import isAuth from '../middlewares/is-auth';

const router = Router();

router.post("/login", [
    check('email').trim().isEmail().isLength({min: 7, max: 30}),
    check('password').trim().isLength({min: 6, max: 20})
], authControllers.login);

router.post("/register", [
    check('first_name').trim().isLength({min: 3, max: 15}),
    check('last_name').trim().isLength({min: 3, max: 15}),
    check('email').trim().isEmail().isLength({min: 7, max: 30}),
    check('password').trim().isLength({min: 6, max: 20})
], authControllers.register);

router.get("/usernames", isAuth, authControllers.getUsersInfo);

export default router;