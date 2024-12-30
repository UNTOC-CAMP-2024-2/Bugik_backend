import {Router} from 'express';
import userRoutes from './user';
import restaurantRouter from './restaurant';
import rankRouter from './rank';
import authRouter from './auth';

const router = Router();

router.use('/users',userRoutes);
router.use('/auth',authRouter);
router.use('/restaurants',restaurantRouter);
router.use('/rank',rankRouter);


export default router;