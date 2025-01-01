import { Router } from 'express';
import multer from "multer";
import path from "path";
import * as reviewController from '../controllers/reviewController';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads")); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// api/v1/review

// 1. 리뷰 추가
router.post('/',upload.single("photo"), reviewController.addReviewByMenuDateId);

// 2. 특정 식단의 리뷰 조회
router.get('/:menu_date_id', reviewController.getReviewByMenuDateId);

export default router;.
