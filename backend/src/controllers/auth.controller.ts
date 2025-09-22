import type { Request, Response } from 'express';
import UserModel from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import "dotenv/config";
import generateToken from '../utils/generateToken.ts';


const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
};

const signUp = async (req: Request, res: Response) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = generateToken(user._id, res);

        res.status(201).json({ message: 'User registered successfully',user:{
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }



};

export { login, signUp };