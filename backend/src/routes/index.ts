import { Router } from 'express';
import { healthController } from '../controllers';
import officersRouter from './officers.routes';
import eventRoutes from './eventRoutes';
import membersRoutes from './members.routes';

const router = Router();

router.get('/health', healthController.health);
router.use('/officers', officersRouter);
router.use('/events', eventRoutes);
router.use('/members', membersRoutes);

export default router;

