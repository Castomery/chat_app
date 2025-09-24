import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.ts";
import { ENV } from "../configs/env.ts";
import type { Request, Response } from "express";


export const authProtectRoute = async (req: Request, res: Response, next: Function) => {

    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ message: "Unathorized - no token" });

        if (!ENV.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Invalide token" });

        const userId = (decoded as any).userId;
        
        if (!userId) return res.status(401).json({ message: "Invalid token payload" });

        const user = await UserModel.findById(userId).select("-password");

        if (!user) res.status(404).json({ message: "User not found" });

        (req as any).user = user;

        next()

    } catch (error) {
        console.log("Error in authProtectRoute", error);
        res.status(500).json({message:"Internal server error"});
    }

}