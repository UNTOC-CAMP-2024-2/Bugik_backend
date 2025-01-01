import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';

const router = Router();

// api/v1/restaurants

// 1. 모든 식당 조회
router.get('/', restaurantController.getAllRestaurants);

// 2. 특정 식당 조회
router.get('/:restaurantId', restaurantController.getRestaurantMealById);

// 3. 날짜별 모든 식당의 모든 식사 조회 (메인 화면)
router.get('/meals/all', restaurantController.getAllMeals); // 명확한 경로 사용

// 4. 특정 식당의 특정 날짜의 식사 조회
router.get('/:restaurantId/meals/:menuDateId', restaurantController.getRestaurantMeals);


export default router;
