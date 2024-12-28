import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';

const router = Router();

/**
 * @route GET /restaurants
 * @desc  식당 목록 조회
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @route GET /restaurants/:restaurantId
 * @desc  특정 식당 상세 조회
 */
router.get('/:restaurantId', restaurantController.getRestaurantById);

/**
 * @route GET /restaurants/:restaurantId/meals
 * @desc  특정 식당의 식단 리스트
 *        (예: Query로 date, time 등 받을 수도 있음)
 */
router.get('/:restaurantId/meals', restaurantController.getRestaurantMeals);

/**
 * @route GET /restaurants/:restaurantId/meals/:menuDateId
 * @desc  특정 식당의 특정 날짜 식단 상세
 */
router.get(
  '/:restaurantId/meals/:menuDateId',
  restaurantController.getSingleMeal
);

export default router;
