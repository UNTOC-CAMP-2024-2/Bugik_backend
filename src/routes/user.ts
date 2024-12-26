import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

/**
 * 사용자 생성
 * - POST /api/v1/users
 */
router.post('/', userController.createUser);

/**
 * 사용자 로그인 기능
 * - POST /api/v1/users/login:
 */

/*
input
{
  "user_id": "202455333",
  "belonging_uni": "정보의생명대학학",
  "nickname": "홍길동"
}
*/
router.post('/login', userController.loginById);

export default router;
