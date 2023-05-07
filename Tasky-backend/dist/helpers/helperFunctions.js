"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.errorThrower = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};
exports.tokenGenerator = (payload) => {
    return jsonwebtoken_1.default.sign(payload, 'secretDecodingString', { expiresIn: '1h' });
};
