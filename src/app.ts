import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './routes/index';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/health', (req: Request, res: Response): void => {
  res.send('Bugik API is working');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
