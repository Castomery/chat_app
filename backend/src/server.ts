import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.routes.ts';
import messageRouter from './routes/message.routes.ts';
import { connectToDB } from './configs/mongoDB.ts';
import { ENV } from './configs/env.ts';
import cookieParser from 'cookie-parser';


const app = express();
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
