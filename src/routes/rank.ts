import { Router } from 'express';
import * as rankController from '../controllers/rankController';

const router = Router();

/**
 * @route GET /rank/restaurants
 * @desc  식당 랭킹 조회
 */
router.get('/restaurants', rankController.getRestaurantRank);

/**
 * @route GET /rank/foods
 * @desc  음식 랭킹 조회
 */
router.get('/foods', rankController.getFoodRank);

export default router;
