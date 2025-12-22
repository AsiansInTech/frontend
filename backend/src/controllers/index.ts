import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services';
import { ok } from '../utils/httpResponses';
import { eventController } from './eventController';

export const healthController = {
  health: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await healthService.getHealth();
      ok(res, data);
    } catch (error) {
      next(error);
    }
  },
};

export { officersController } from './officers.controller';
export { eventController };
export { membersController } from './members.controller';

