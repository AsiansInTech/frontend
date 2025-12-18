import { Router } from 'express';
import { healthController } from '../controllers';
import officersRouter from './officers.routes';

const router = Router();

router.get('/health', healthController.health);
router.use('/officers', officersRouter);

export default router;

