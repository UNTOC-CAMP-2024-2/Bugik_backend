import { Request, Response } from 'express';
import * as ticketModel from '../models/ticketModel'; // 티켓 관련
import * as chatRoomModel from '../models/chatRoomModel'; // 채팅방 관련
import * as chatMessageModel from '../models/chatMessageModel'; // 채팅 메시지 관련

// 티켓 리스트 조회
export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await ticketModel.getTickets();
    res.status(200).json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error });
  }
};

// 티켓 상세 조회
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await ticketModel.getTicketById(Number(id));
    if (ticket.length === 0) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
    } else {
      res.status(200).json({ success: true, data: ticket[0] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 티켓 생성
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seller_id, title, description, price } = req.body;
    const result = await ticketModel.createTicket({ seller_id, title, description, price });
    res.status(201).json({ success: true, ticket_id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 티켓 상태 업데이트
export const updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await ticketModel.updateTicketStatus(Number(id), status);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
    } else {
      res.status(200).json({ success: true, message: 'Ticket status updated' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 채팅방 생성
export const createChatRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticket_id, buyer_id, seller_id } = req.body;
    const result = await chatRoomModel.createChatRoom({ ticket_id, buyer_id, seller_id });
    res.status(201).json({ success: true, chat_room_id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 특정 채팅방의 메시지 조회
export const getMessagesByChatRoomId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chat_room_id } = req.params;
    const messages = await chatMessageModel.getMessagesByChatRoomId(Number(chat_room_id));
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 메시지 추가
export const createChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chat_room_id, sender_id, message } = req.body;
    const result = await chatMessageModel.createChatMessage({ chat_room_id, sender_id, message });
    res.status(201).json({ success: true, message_id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
