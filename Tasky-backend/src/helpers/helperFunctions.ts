import {JsonError} from './interfaces.module';
import jwt from 'jsonwebtoken';

export const errorThrower: (message: string, statusCode: number) => void = (message, statusCode) => {
    const error: JsonError = new Error(message);
    error.statusCode = statusCode;
    throw error;
}; 

export const tokenGenerator: (payload: Object) => string = (payload) => {
    return jwt.sign(payload, 'secretDecodingString', {expiresIn: '1h'});
}