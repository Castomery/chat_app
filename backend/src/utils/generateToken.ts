import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import {ENV} from '../configs/env.js';

 const generateToken = (userId: Object, res: Response) => {

    const {JWT_SECRET} = ENV;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.cookie('token', token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return token;
}

export default generateToken;