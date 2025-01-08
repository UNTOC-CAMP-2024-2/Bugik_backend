import db from '../data/db';
import { RowDataPacket, OkPacket } from 'mysql2';

// Ticket 타입 정의
interface Ticket {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price: number;
  status: '거래가능' | '거래완료' | '거래취소';
  created_at: Date;
  updated_at: Date;
}

// 티켓 리스트 조회
export const getTickets = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * 
    FROM tickets
    WHERE status = '거래가능'
    ORDER BY created_at DESC;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query);
  return rows;
};

// 특정 티켓 조회
export const getTicketById = async (id: number): Promise<RowDataPacket[]> => {
  const query = `
    SELECT * 
    FROM tickets
    WHERE id = ?;
  `;
  const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
  return rows;
};

// 티켓 생성
export const createTicket = async (ticket: Partial<Ticket>): Promise<OkPacket> => {
  const query = `
    INSERT INTO tickets (seller_id, title, description, price, status)
    VALUES (?, ?, ?, ?, '거래가능');
  `;
  const [result] = await db.execute<OkPacket>(query, [
    ticket.seller_id,
    ticket.title,
    ticket.description,
    ticket.price,
  ]);
  return result;
};

// 티켓 상태 업데이트
export const updateTicketStatus = async (id: number, status: '거래완료' | '거래취소'): Promise<OkPacket> => {
  const query = `
    UPDATE tickets
    SET status = ?
    WHERE id = ?;
  `;
  const [result] = await db.execute<OkPacket>(query, [status, id]);
  return result;
};
