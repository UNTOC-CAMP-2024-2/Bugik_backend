import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from "path";

import routes from './routes/index';
import { setupSwagger } from './swagger';

import { initializeSocket } from './sockets/socket'; // 소켓 초기화 함수

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/v1', routes);
initializeSocket(server);

setupSwagger(app);

app.get('/health', (req: Request, res: Response): void => {
  res.send('Bugik API is working');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
