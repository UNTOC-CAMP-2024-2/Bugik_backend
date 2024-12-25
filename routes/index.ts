import {Router} from 'express';
import userRoutes from './user';
/*
import restaurantRoutes from './restaurant';
import menuRoutes from './menu';
import reviewRoutes from './review';
import rateRoutes from './rate';
*/
const router = Router();

router.use('/users',userRoutes);
/*
router.use('/restaurants',restaurantRoutes);
router.use('/menus',menuRoutes);
router.use('/reviews',reviewRoutes);
router.use('/ratings',rateRoutes);
*/
export default router;