import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.ts";
import {ENV} from '../configs/env.ts';
import type { Socket } from "socket.io";

export const socketAuthMiddleware = async(socket : Socket, next : Function)=>{
    try{
        const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

        if(!token){
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unacuthorized"));
        }

        const decode = jwt.verify(token, ENV.JWT_SECRET as string);
        if(!decode){
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unacuthorized"));
        }

        const user = await UserModel.findById((decode as any).userId).select("-password");

        if (!user){
            console.log("Socket connection rejected: No token provided");
            return next(new Error("User not found"));
        };

        socket.user = user;
        socket.userId = user._id.toString();

        next()


    }catch(error){
        console.log("Error in socket");
        next(new Error("Unauthorized"));
    }
}