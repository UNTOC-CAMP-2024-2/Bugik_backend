import { Request, Response } from 'express';
import * as chatRoomModel from '../models/chatModel';
import { RowDataPacket } from 'mysql2';

export const createChatRoom = async (req: Request, res: Response): Promise<void> => {
    console.log("시작");
    const { title, restaurant, maxParticipants } = req.body;
  console.log('title:', title);
  console.log('restaurant:', restaurant);
  console.log('maxParticipants:', maxParticipants);
  try {
    const [result] = await chatRoomModel.createChatRoom({
      title,
      restaurant,
      maxParticipants,
    });
    console.log('result:', result);
    res.status(201).json({ roomId: result.insertId });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const joinChatRoom = async (req: Request, res: Response): Promise<any> => {
  const { chatRoomId, userId } = req.body;

  try {
    const [rooms] = await chatRoomModel.getChatRoom(chatRoomId);
    const room = (rooms as RowDataPacket[])[0]; // 데이터베이스에서 반환된 첫 번째 행

    if (room.current_participants >= room.max_participants) {
      return res.status(400).json({ error: 'Room is full' });
    }

    await chatRoomModel.addParticipant(chatRoomId, userId);
    await chatRoomModel.updateParticipantCount(chatRoomId, 1);

    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
};

export const getAllChatRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rooms] = await chatRoomModel.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

//export getAllChatRooms = async (req: Request, res: Response): Promise<void> => {