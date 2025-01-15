import {Router} from 'express';
import userRoutes from './user';
import restaurantRouter from './restaurant';
import rankRouter from './rank';
import authRouter from './auth';
import reviewRouter from './review';
import contentRouter from './contents';
import chatRouter from './chat';
import express from 'express';
import { getInfoFromChatgpt, getInfoFromGemini } from '../controllers/contentsController';

const router = Router();

router.use('/users',userRoutes);
router.use('/auth',authRouter);
router.use('/restaurants',restaurantRouter);
router.use('/rank',rankRouter);
router.use('/review',reviewRouter);
router.use('/contents',contentRouter);
router.use('/chat',chatRouter)

router.get('/chatgpt', getInfoFromChatgpt);
router.get('/gemini', getInfoFromGemini);


export default router;