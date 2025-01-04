import { Router } from 'express';
import * as rankController from '../controllers/rankController';

const router = Router();


router.get('/restaurants/all', rankController.getRestaurantRank);
router.get('/restaurants/uni', rankController.getRestaurantRankUni);
router.get('/restaurants/dorm', rankController.getRestaurantRankDorm);

router.get('/foods/all', rankController.getFoodRank);

export default router;