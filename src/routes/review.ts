import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { verifyAccessToken } from '../middlewares/authMiddleware';
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

// api/v1/review

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a review
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               menu_date_id:
 *                 type: string
 *               email:
 *                 type: string
 *               comment:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Review added
 */
router.post('/', upload.single("photo"), reviewController.addReviewByMenuDateId);

/**
 * @swagger
 * /reviews/photo/{key}:
 *   get:
 *     summary: Get photo from S3
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Photo retrieved
 */
router.get('/photo/:key', reviewController.getPhotoFromS3);

/**
 * @swagger
 * /reviews/{menu_date_id}:
 *   get:
 *     summary: Get reviews by menu date ID
 *     parameters:
 *       - in: path
 *         name: menu_date_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved
 */
router.get('/:menu_date_id', reviewController.getReviewByMenuDateId);

export default router;