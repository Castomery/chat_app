import express from 'express';
import { getAllChats, getAllContacts, getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { authProtectRoute } from '../middleware/auth.middleware.js';
import arcjectProtection from '../middleware/arcject.middleware.js';

const messageRouter = express.Router();

messageRouter.use(arcjectProtection, authProtectRoute);

messageRouter.get('/contacts',getAllContacts);
messageRouter.get('/chats',getAllChats);
messageRouter.get('/:id',getMessagesByUserId);

messageRouter.post("/send/:id",sendMessage);

export default messageRouter;