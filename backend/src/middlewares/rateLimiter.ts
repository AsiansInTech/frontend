import rateLimit from 'express-rate-limit';

export const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many signup attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictSignupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: 'You have exceeded the maximum number of signup attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

