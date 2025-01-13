import express from 'express';
import { createChatRoom, joinChatRoom, getAllChatRooms } from '../controllers/chatController';

const router = express.Router();

router.post('/create-room', createChatRoom);
router.post('/join-room', joinChatRoom);
router.get('/rooms', getAllChatRooms);
router.get('/rooms/:roomId', getAllChatByRoomId);

export default router;
