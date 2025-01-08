import db from '../data/db';
import { RowDataPacket, OkPacket } from 'mysql2';

// ChatRoom 타입 정의
interface ChatRoom {
  id: number;
  ticket_id: number;
  buyer_id: number;
  seller_id: number;
  created_at: Date;
}

// 채팅방 리스트 조회 (사용자별)
export const getChatRoomsByUserId = async (userId: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * 
    FROM chat_rooms
    WHERE buyer_id = ? OR seller_id = ?
    ORDER BY created_at DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [userId, userId]);
  return rows;
};

// 특정 티켓의 채팅방 조회
export const getChatRoomByTicketId = async (ticketId: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * 
    FROM chat_rooms
    WHERE ticket_id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [ticketId]);
  return rows;
};

// 채팅방 생성
export const createChatRoom = async (chatRoom: Partial<ChatRoom>): Promise<OkPacket> => {
  const query = `
    INSERT INTO chat_rooms (ticket_id, buyer_id, seller_id)
    VALUES (?, ?, ?);
  `;
  const [result] = await db.execute<OkPacket>(query, [
    chatRoom.ticket_id,
    chatRoom.buyer_id,
    chatRoom.seller_id,
  ]);
  return result;
};
