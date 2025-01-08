import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';

const router = Router();

//라우터 분리해야함 현재 다 짬떄려둔 상태.
//일단 api들 출력들하고 형식들 함수 일름들 구현안해둔 기능들 다 구현하고 api 마감 처리 시작, 테스트 코드 작성 하면서 하나하나 테스트해야함
//테스트 코드 작성하면서 에러나는 부분들 수정하고 마무리 작업 시작

// 티켓 관련
router.get('/tickets', transactionController.getTickets); // 티켓 리스트 조회
router.get('/tickets/:id', transactionController.getTicketById); // 특정 티켓 조회
router.post('/tickets', transactionController.createTicket); // 티켓 생성
router.put('/tickets/:id/status', transactionController.updateTicketStatus); // 티켓 상태 업데이트

// 채팅방 관련
router.post('/chat_rooms', transactionController.createChatRoom); // 채팅방 생성

// 메시지 관련
router.get('/chat_rooms/:chat_room_id/messages', transactionController.getMessagesByChatRoomId); // 메시지 조회
router.post('/chat_messages', transactionController.createChatMessage); // 메시지 추가

export default router;
