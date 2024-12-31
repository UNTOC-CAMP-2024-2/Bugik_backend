import { Router } from 'express';
import * as authController from '../controllers/authController';

const authRouter = Router();

// /api/v1/auth/...

authRouter.get('/kakao', authController.KakaoRedirect);
authRouter.get('/kakao/callback', authController.KakaoCallback);
authRouter.patch('/kakao', authController.KakaoPatch);

authRouter.post('/email', authController.createUserByEmail); 
authRouter.post('/email/login', authController.loginByEmail); 
authRouter.post('/email/auth', authController.sendEmailCode);  
authRouter.post('/email/verfiy',authController.verifyEmailCode); 

authRouter.post('/logout', authController.logout);
authRouter.post('/token/refresh', authController.refreshToken);

export default authRouter;
