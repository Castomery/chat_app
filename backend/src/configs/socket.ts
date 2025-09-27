import {Server} from "socket.io";
import http from "http";
import express from "express";
import {ENV} from "./env.ts"
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.ts";


const app = express();
const server = http.createServer(app);

const socketServer = new Server(server,{
    cors: {
        origin: ENV.CLIENT_URL,
        credentials:true,
    },
});

socketServer.use(socketAuthMiddleware);

export function getReceiverSocketId(userId : any){
    return (userSocketMap as any)[userId];
}

const userSocketMap = {};

socketServer.on("connection", (socket) => {
    console.log("User connected", (socket as any).user.fullName);
    const userId = (socket as any).userId;
    (userSocketMap as any)[userId] = socket.id;

    socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("User disconnected", (socket as any).user.fullName);
        delete (userSocketMap as any)[userId];
        socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {server, socketServer, app};