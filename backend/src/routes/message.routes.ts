import express from 'express';

const messageRouter = express.Router();

messageRouter.post('/send', (req, res) => {
  // Handle sending a message
  res.send('Send message endpoint');
});

export default messageRouter;