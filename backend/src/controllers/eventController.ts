import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService';
import { ok, notFound } from '../utils/httpResponses';

export const eventController = {
  /**
   * GET /api/events
   * Get all events
   */
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = await eventService.getAllEvents();
      ok(res, { events });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/events/:id
   * Get a single event by ID
   */
  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      if (!event) {
        notFound(res, 'Event not found');
        return;
      }

      ok(res, event);
    } catch (error) {
      next(error);
    }
  },
};

