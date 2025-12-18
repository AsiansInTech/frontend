import { Router } from 'express';
import { officersController } from '../controllers/officers.controller';

const router = Router();

router.get('/', officersController.getOfficers);

export default router;

