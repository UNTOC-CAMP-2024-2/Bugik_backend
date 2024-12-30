import { Router } from 'express';
import * as authController from '../controllers/authController';

const authRouter = Router();

authRouter.get('/kakao', authController.KakaoRedirect);
authRouter.get('/kakao/callback', authController.KakaoCallback);
authRouter.patch('/kakao', authController.KakaoPatch);

authRouter.post('/email', authController.createUserByEmail); //구현 완료
authRouter.post('/email/login', authController.loginByEmail); 
authRouter.post('/email/auth', authController.sendEmailCode);  // 구현 완료
authRouter.post('/email/verfiy',authController.verifyEmailCode); //구현 완료

authRouter.post('/refresh', authController.refreshToken);

export default authRouter;
