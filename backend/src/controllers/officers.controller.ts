import { Request, Response, NextFunction } from 'express';
import { officersService } from '../services/officers.service';
import { ok } from '../utils/httpResponses';

export const officersController = {
  getOfficers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const officers = await officersService.getOfficers();
      ok(res, { officers });
    } catch (error) {
      next(error);
    }
  },
};

