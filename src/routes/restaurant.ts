import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';

const router = Router();

// api/v1/restaurants

router.get('/', restaurantController.getAllRestaurants);
router.get('/:restaurantId', restaurantController.getRestaurantMealById);
router.get('/meals/all', restaurantController.getAllMeals); 
router.get('/:restaurantId/meals/:menuDateId', restaurantController.getRestaurantMeals);

export default router;
