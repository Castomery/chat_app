import express from 'express';
import { login, signUp,logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { authProtectRoute } from '../middleware/auth.middleware.js';
import arcjectProtection from '../middleware/arcject.middleware.js';

const authRouter = express.Router();

authRouter.use(arcjectProtection);

authRouter.post('/login', login);
authRouter.post('/signup', signUp);
authRouter.post('/logout',logout);
authRouter.put('/update-profile', authProtectRoute, updateProfile);
authRouter.get('/check-auth',authProtectRoute, checkAuth);

export default authRouter;