import {Router} from 'express';
import userRoutes from './user';
import restaurantRouter from './restaurant';
import rankRouter from './rank';
import authRouter from './auth';
import reviewRouter from './review';

const router = Router();

router.use('/users',userRoutes);
router.use('/auth',authRouter);
router.use('/restaurants',restaurantRouter);
router.use('/rank',rankRouter);
router.use('/review',reviewRouter);

export default router;