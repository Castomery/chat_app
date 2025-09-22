import express from 'express';

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  // Handle login
  res.send('Login endpoint');
});
authRouter.post('/register', (req, res) => {
  // Handle registration
  res.send('Register endpoint');
});

export default authRouter;