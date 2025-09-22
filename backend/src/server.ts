import express from 'express';
import cors from 'cors';
import "dotenv/config";
import path from 'path';
import authRouter from './routes/auth.routes.ts';
import messageRouter from './routes/message.routes.ts';


const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);



if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
