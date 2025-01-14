import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import routes from './routes/index';
import { setupSwagger } from './swagger';

import { Server as SocketIOServer } from 'socket.io';
import registerChatSocketHandlers from './sockets/chatSocket';

dotenv.config();
const app: Application = express();

// CORS 설정
app.use(cors({
  origin: '*', // 모든 출처에서 요청을 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용하는 HTTP 메서드 설정
  allowedHeaders: ['Content-Type', 'Authorization'] // 허용하는 헤더 설정
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/api/v1', routes);

// 서버 설정
setupSwagger(app);
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  registerChatSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get('/health', (req: Request, res: Response): void => {
  res.send('Bugik API is working');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default server;