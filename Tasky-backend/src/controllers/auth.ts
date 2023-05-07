import User from '../models/User';
import {RequestHandler} from 'express';
import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as helperFunctions from '../helpers/helperFunctions'
import { authRequest, userDocument } from '../helpers/interfaces.module';

export const login: RequestHandler = async (req, res, next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        helperFunctions.errorThrower("Validation error! Please check your inputs.", 400);
    }

    const email: string = (req.body as {email:string;}).email;
    const password: string = (req.body as {password:string;}).password;
    const user = await User.findOne({email});
    if(!user){
      helperFunctions.errorThrower('Email or password is incorrect!', 401);
      return;
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
      helperFunctions.errorThrower('Email or password is incorrect!', 401);
    }

    const token = helperFunctions.tokenGenerator({_id: user._id.toString(), email});

    return res.status(201).json({message: "User registered successfully!", user: {
      id: user._id.toString(),
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email 
      }
    });
  }catch(err){
    next(err);
  }

} 

export const register: RequestHandler = async (req, res, next) => {
  try{
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          helperFunctions.errorThrower("Validation error! Please check your inputs.", 400);
      }
    const firstName: string = (req.body as {first_name:string;}).first_name;
    const lastName: string = (req.body as {last_name:string;}).last_name;
    const email: string = (req.body as {email:string;}).email;
    const password: string = (req.body as {password:string;}).password;

    const isUser = await User.findOne({email}); 

    if(isUser){
      helperFunctions.errorThrower("Email is already taken!", 401);
    }

    const hashedPassword: string = await bcrypt.hash(password, 12);

    const newUser: mongoose.Document = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    
    const savedUser = await newUser.save(); 
    
    const token = helperFunctions.tokenGenerator({_id: savedUser._id.toString(), email});
    return res.status(201).json({message: "User registered successfully!", user: {
      id: savedUser._id.toString(),
      token,
      firstName,
      lastName,
      email 
    }});
    }catch(err){
      next(err);
    }  
} 

export const getUsersInfo: RequestHandler = async (req: authRequest, res, next) => {
  try{
    if(!req.isAuth || !req.userId){
      helperFunctions.errorThrower("Unauthorized", 401);
      return;
    }

    const users = await User.find();
    const usersInfo = users.map((user: userDocument)=>{
      return {
        id: user._id.toString(),
        name: user.firstName + ' ' + user.lastName
      }
    })
    res.status(200).json({users: usersInfo});

  }catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}