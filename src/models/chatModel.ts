import db  from '../data/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 채팅방 정보 조회
export const getChatRoom = async (chatRoomId: number) => {
  return db.execute<RowDataPacket[]>(
    'SELECT * FROM chat_rooms WHERE id = ?',
    [chatRoomId]
  );
};

// 채팅방 생성
export const createChatRoom = async (data: { title: string; restaurant: string; maxParticipants: number }) => {
  return db.execute<ResultSetHeader>(
    'INSERT INTO chat_rooms (title, restaurant, max_participants) VALUES (?, ?, ?)',
    [data.title, data.restaurant, data.maxParticipants]
  );
};

// 참가자 추가
export const addParticipant = async (chatRoomId: number, email: string) => {
  return db.execute<ResultSetHeader>(
    'INSERT INTO chat_room_participants (chat_room_id, email) VALUES (?, ?)',
    [chatRoomId, email]
  );
};

// 현재 참가자 수 업데이 
export const createChatMessage = async (chat_room_id: number, email: string, message: string): Promise<ResultSetHeader> => {
    const query = `INSERT INTO chat_messages (chat_room_id, email, message) VALUES (?, ?, ?)`;
    const [result] = await db.execute<ResultSetHeader>(query, [chat_room_id, email, message]);
    return result;
  };

  // 현재 참가자 수 업데이트
export const updateParticipantCount = async (chatRoomId: number, increment: number) => {
    return db.execute<ResultSetHeader>(
      'UPDATE chat_rooms SET current_participants = current_participants + ? WHERE id = ?',
      [increment, chatRoomId]
    );
  };

  // 모든 채팅방 가져오기
export const getAllRooms = async () => {
    return db.execute<RowDataPacket[]>(
      'SELECT * FROM chat_rooms'
    );
};

export const getAllChats = async (chatRoomId: number) => {
    return db.execute<RowDataPacket[]>(
      'SELECT * FROM chat_messages WHERE chat_room_id = ?',
      [chatRoomId]
    );
};
