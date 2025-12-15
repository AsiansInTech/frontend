import { Response } from 'express';

export const ok = (res: Response, data: unknown): void => {
  res.status(200).json(data);
};

export const serverError = (res: Response, message?: string): void => {
  res.status(500).json({ message: message || 'Internal server error' });
};

