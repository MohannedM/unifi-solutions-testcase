"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        req.userId = null;
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        req.userId = null;
        req.isAuth = false;
        return next();
    }
    const jwtVerified = jsonwebtoken_1.default.verify(token, 'secretDecodingString');
    const currentDate = new Date().getTime();
    if (currentDate > (jwtVerified.exp * 1000)) {
        req.userId = null;
        req.isAuth = false;
        return next();
    }
    req.userId = jwtVerified._id;
    req.isAuth = true;
    next();
};
exports.default = isAuth;
