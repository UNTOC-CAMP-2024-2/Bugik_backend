import { Router } from 'express';
import * as rankController from '../controllers/rankController';

const router = Router();


router.get('/restaurants/all', rankController.getRestaurantRank);
router.get('/restaurants/uni', rankController.getRestaurantRank);
router.get('/restaurants/dorm', rankController.getRestaurantRank);

router.get('/foods/all', rankController.getFoodRank);

export default router;
