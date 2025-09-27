import type { Request, Response } from 'express';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { ENV } from '../configs/env.js';
import cloudinary from '../configs/cloudinary.js';


const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id, res);

        res.status(200).json({
            message: 'Login successful', user: {
                _id: user._id,
                fullName: user.fullName,
            }, token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
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

        try {
            if (ENV.CLIENT_URL) {
                await sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL);
            } else {
                console.error('CLIENT_URL is not defined');
            }
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }

        res.status(201).json({
            message: 'User registered successfully', user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            }, token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = async (_: Request, res: Response) => {
    res.cookie('token', "", { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
};

const updateProfile = async (req: Request, res: Response) => {

    try {

        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Picture requared" });

        const userId = (req as any).user._id;

        const uploadRes = await cloudinary.uploader.upload(profilePic);

        const updateUser = await UserModel.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true });

        res.status(200).json(updateUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }


}

const checkAuth = async(req: Request, res: Response) => {
    res.status(200).json((req as any).user);
}

export { login, signUp, logout, updateProfile, checkAuth };