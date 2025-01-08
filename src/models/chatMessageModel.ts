import db from '../data/db';
import { RowDataPacket, OkPacket } from 'mysql2';

// ChatMessage 타입 정의
interface ChatMessage {
  id: number;
  chat_room_id: number;
  sender_id: number;
  message: string;
  sent_at: Date;
}

// 특정 채팅방의 메시지 조회
export const getMessagesByChatRoomId = async (chatRoomId: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * 
    FROM chat_messages
    WHERE chat_room_id = ?
    ORDER BY sent_at ASC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [chatRoomId]);
  return rows;
};

// 채팅 메시지 추가
export const createChatMessage = async (chatMessage: Partial<ChatMessage>): Promise<OkPacket> => {
  const query = `
    INSERT INTO chat_messages (chat_room_id, sender_id, message)
    VALUES (?, ?, ?);
  `;
  const [result] = await db.execute<OkPacket>(query, [
    chatMessage.chat_room_id,
    chatMessage.sender_id,
    chatMessage.message,
  ]);
  return result;
};
