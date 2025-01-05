import { Router } from 'express';
import * as contentController from '../controllers/contentsController';

const router = Router();

router.get('/chatgpt', contentController.getInfoFromChatgpt);
router.get('/geminai', contentController.getInfoFromGeminai);

export default router;