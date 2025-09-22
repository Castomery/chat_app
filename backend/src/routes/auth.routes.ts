import express from 'express';
import { login, signUp } from '../controllers/auth.controller.ts';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', signUp);

export default authRouter;