
import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import {verifyAccessToken} from '../middlewares/authMiddleware';
import upload from '../utils/upload';

const router = Router();
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, "../../uploads")); 
//     },
//     filename: (req, file, cb) => {
//         const menuDateId = req.body.menu_date_id;
//         const email = req.body.email;
//         cb(null, `${menuDateId}-${email.replace("@","")}-${Date.now()}`);
//     },
// });

// const upload = multer({ storage });


/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   review_id:
 *                     type: integer
 *                   restaurant_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 */
router.get('/', reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review_id:
 *                   type: integer
 *                 restaurant_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 rating:
 *                   type: number
 *                 comment:
 *                   type: string
 */
router.get('/:reviewId', reviewController.getReviewById);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/', reviewController.createReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/:reviewId', reviewController.updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:reviewId', reviewController.deleteReview);

export default router;