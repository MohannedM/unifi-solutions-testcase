"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helperFunctions = __importStar(require("../helpers/helperFunctions"));
exports.login = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            helperFunctions.errorThrower("Validation error! Please check your inputs.", 400);
        }
        const email = req.body.email;
        const password = req.body.password;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            helperFunctions.errorThrower('Email or password is incorrect!', 401);
            return;
        }
        const isPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isPassword) {
            helperFunctions.errorThrower('Email or password is incorrect!', 401);
        }
        const token = helperFunctions.tokenGenerator({ _id: user._id.toString(), email });
        return res.status(201).json({ message: "User registered successfully!", user: {
                id: user._id.toString(),
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                email
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = async (req, res, next) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            helperFunctions.errorThrower("Validation error! Please check your inputs.", 400);
        }
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;
        const isUser = await User_1.default.findOne({ email });
        if (isUser) {
            helperFunctions.errorThrower("Email is already taken!", 401);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        const token = helperFunctions.tokenGenerator({ _id: savedUser._id.toString(), email });
        return res.status(201).json({ message: "User registered successfully!", user: {
                id: savedUser._id.toString(),
                token,
                firstName,
                lastName,
                email
            } });
    }
    catch (err) {
        next(err);
    }
};
exports.getUsersInfo = async (req, res, next) => {
    try {
        if (!req.isAuth || !req.userId) {
            helperFunctions.errorThrower("Unauthorized", 401);
            return;
        }
        const users = await User_1.default.find();
        const usersInfo = users.map((user) => {
            return {
                id: user._id.toString(),
                name: user.firstName + ' ' + user.lastName
            };
        });
        res.status(200).json({ users: usersInfo });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
