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

// api/v1/review

// 1. 리뷰 추가
//router.post('/',verifyAccessToken,upload.single("photo"), reviewController.addReviewByMenuDateId);
router.post('/',upload.single("photo"), reviewController.addReviewByMenuDateId);

router.get('/photo/:key', reviewController.getPhotoFromS3);

// 2. 특정 식단의 리뷰 조회
router.get('/:menu_date_id', reviewController.getReviewByMenuDateId);



export default router;
