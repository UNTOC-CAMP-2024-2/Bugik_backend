import { Server, Socket } from 'socket.io';
import * as chatMessageModel from '../models/chatMessageModel'; 
import * as chatRoomModel from '../models/chatRoomModel'; 

const registerChatSocketHandlers = (io: Server, socket: Socket): void => {

  socket.on('join_room', async ({ chatRoomId }) => {
    try {
      socket.join(`room_${chatRoomId}`);
      console.log(`Client ${socket.id} joined room_${chatRoomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  });

  socket.on('send_message', async ({ chatRoomId, senderId, message }) => {
    try {
      const savedMessage = await chatMessageModel.createChatMessage({
        chat_room_id: chatRoomId,
        sender_id: senderId,
        message,
      });

      io.to(`room_${chatRoomId}`).emit('receive_message', {
        message_id: savedMessage.insertId,
        chat_room_id: chatRoomId,
        sender_id: senderId,
        message,
        sent_at: new Date(), 
      });

      console.log(`Message sent to room_${chatRoomId}:`, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('leave_room', ({ chatRoomId }) => {
    socket.leave(`room_${chatRoomId}`);
    console.log(`Client ${socket.id} left room_${chatRoomId}`);
  });
};

export default registerChatSocketHandlers;
