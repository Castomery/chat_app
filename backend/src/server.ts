import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.routes.js';
import messageRouter from './routes/message.routes.js';
import { connectToDB } from './configs/mongoDB.js';
import { ENV } from './configs/env.js';
import cookieParser from 'cookie-parser';
import { app, server } from './configs/socket.js';


const PORT = ENV.PORT;
const __dirname = path.resolve();



connectToDB();


app.use(express.json({limit:"5mb"}));
app.use(cors({origin: ENV.CLIENT_URL, credentials:true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);



if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
