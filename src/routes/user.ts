import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/checkUsername', userController.checkUserName);

userRouter.get('/checkEmail', userController.checkEmail);

export default userRouter;
