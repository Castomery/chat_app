import express from 'express';
import { login, signUp,logout } from '../controllers/auth.controller.ts';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', signUp);
authRouter.post('/logout', logout);

export default authRouter;