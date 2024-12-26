import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './routes/index';

dotenv.config();

const app: Application = express();

// 미들웨어
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/v1', routes);

// 간단 테스트용 루트 엔드포인트
app.get('/health', (req: Request, res: Response) => {
  res.send('Bugik API is working');
});

// 404 처리
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
