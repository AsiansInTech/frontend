import { Router } from 'express';
import { membersController } from '../controllers/members.controller';
import { signupRateLimiter, strictSignupRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

// POST /api/members - Create a new member
// Rate limited: 5 attempts per 15 min, 20 attempts per hour
router.post('/', signupRateLimiter, strictSignupRateLimiter, membersController.createMember);

export default router;


