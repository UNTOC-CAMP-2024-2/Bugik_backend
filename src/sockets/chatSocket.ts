import { Server, Socket } from 'socket.io';
import * as chatRoomModel from '../models/chatModel';
import * as chatMessageModel from '../models/chatModel'; // 경로를 수정했습니다.

const registerChatSocketHandlers = (io: Server, socket: Socket): void => {
  socket.on('join_room', async ({ chatRoomId, email }) => {
    try {
      const [rows] = await chatRoomModel.getChatRoom(chatRoomId);
      const room = rows[0]; // RowDataPacket[]의 첫 번째 요소를 명시적으로 선택합니다.

      if (room.current_participants >= room.max_participants) {
        socket.emit('join_error', { error: 'Room is full' });
        return;
      }

      await chatRoomModel.addParticipant(chatRoomId, email);
      await chatRoomModel.updateParticipantCount(chatRoomId, 1);

      socket.join(`room_${chatRoomId}`);
      console.log(`Client ${socket.id} joined room_${chatRoomId}`);

      io.to(`room_${chatRoomId}`).emit('user_joined', { email });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('join_error', { error: 'Failed to join room' });
    }
  });

  socket.on('send_message', async ({ chatRoomId, email, message }) => {
    try {
      const savedMessage = await chatMessageModel.createChatMessage(
        chatRoomId, // chat_room_id
        email,      // email
        message     // message
      );
  
      io.to(`room_${chatRoomId}`).emit('receive_message', {
        message_id: savedMessage.insertId,
        chat_room_id: chatRoomId,
        email,
        message,
        // sent_at: new Date(), // 이 줄을 삭제하세요
      });
  
      console.log(`Message sent to room_${chatRoomId}:`, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  

  socket.on('leave_room', async ({ chatRoomId }) => {
    socket.leave(`room_${chatRoomId}`);
    console.log(`Client ${socket.id} left room_${chatRoomId}`);

    await chatRoomModel.updateParticipantCount(chatRoomId, -1);
  });
};

export default registerChatSocketHandlers;
