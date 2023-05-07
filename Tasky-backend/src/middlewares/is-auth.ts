import {authRequest, jwtObject} from '../helpers/interfaces.module';
import { RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

const isAuth: RequestHandler  = (req: authRequest, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        req.userId = null;
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        req.userId = null;
        req.isAuth = false;
        return next();
    }

    const jwtVerified = <jwtObject>jwt.verify(token, 'secretDecodingString');
    const currentDate = new Date().getTime();
    if(currentDate > (jwtVerified.exp * 1000)){
        req.userId = null;
        req.isAuth = false;
        return next();
    }
    req.userId = jwtVerified._id;
    req.isAuth = true;
    next();

}

export default isAuth;