"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    const token = req.headers;
    console.log(token);
};
exports.default = isAuth;
