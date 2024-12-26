import {Router} from 'express';
import userRoutes from './user';
import restaurantRouter from './restaurant';
import rankRouter from './rank';

const router = Router();

router.use('/users',userRoutes);
router.use('/restaurants',restaurantRouter);
router.use('/rank',rankRouter);

export default router;