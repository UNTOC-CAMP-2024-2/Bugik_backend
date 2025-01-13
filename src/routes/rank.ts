import { Router } from 'express';
import * as rankController from '../controllers/rankController';

const router = Router();

/**
 * @swagger
 * /rank/restaurants:
 *   get:
 *     summary: Get restaurant rankings
 *     responses:
 *       200:
 *         description: A list of restaurant rankings
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
 *                   rank:
 *                     type: integer
 */
router.get('/restaurants/all', rankController.getRestaurantRank);
router.get('/restaurants/uni', rankController.getRestaurantRankUni);
router.get('/restaurants/dorm', rankController.getRestaurantRankDorm);

/**
 * @swagger
 * /rank/foods:
 *   get:
 *     summary: Get food rankings
 *     responses:
 *       200:
 *         description: A list of food rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   food_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   rank:
 *                     type: integer
 */
router.get('/foods/all', rankController.getFoodRank);

export default router;