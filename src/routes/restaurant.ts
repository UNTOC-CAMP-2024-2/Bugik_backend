import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';

const router = Router();

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     responses:
 *       200:
 *         description: A list of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurant_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /restaurants/{restaurantId}:
 *   get:
 *     summary: Get restaurant by ID
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 */
router.get('/:restaurantId', restaurantController.getRestaurantMealById);

/**
 * @swagger
 * /restaurants/meals/all:
 *   get:
 *     summary: Get all meals for all restaurants
 *     responses:
 *       200:
 *         description: A list of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurant_id:
 *                     type: integer
 *                   menu_date_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   time:
 *                     type: string
 */
router.get('/meals/all', restaurantController.getAllMeals);

/**
 * @swagger
 * /restaurants/{restaurantId}/meals/{menuDateId}:
 *   get:
 *     summary: Get meals for a specific restaurant and date
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: menuDateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meals for the specified restaurant and date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant_id:
 *                   type: integer
 *                 menu_date_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 time:
 *                   type: string
 */
router.get('/:restaurantId/meals/:menuDateId', restaurantController.getRestaurantMeals);

export default router;
