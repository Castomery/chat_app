import jwt from 'jsonwebtoken';
import type { Response } from 'express';

 const generateToken = (id: Object, res: Response) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return token;
}

export default generateToken;