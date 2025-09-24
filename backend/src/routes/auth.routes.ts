import express from 'express';
import { login, signUp,logout, updateProfile, checkAuth } from '../controllers/auth.controller.ts';
import { authProtectRoute } from '../middleware/auth.middleware.ts';
import arcjectProtection from '../middleware/arcject.middleware.ts';

const authRouter = express.Router();

authRouter.use(arcjectProtection);

authRouter.post('/login', login);
authRouter.post('/signup', signUp);
authRouter.post('/logout',logout);
authRouter.post('/update', authProtectRoute, updateProfile)

authRouter.get('/check-auth',authProtectRoute, checkAuth)

export default authRouter;