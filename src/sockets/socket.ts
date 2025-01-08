import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import registerChatSocketHandlers from './chatsocket'; 

let io: SocketIOServer | null = null;

export const initializeSocket = (server: HttpServer): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', 
    },
  });

  console.log('Socket.IO initialized.');
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    registerChatSocketHandlers(io!, socket);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getSocketInstance = (): SocketIOServer | null => {
  return io;
};
