import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { serverError } from '../utils/httpResponses';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', err.message, err.stack);
  serverError(res);
};

