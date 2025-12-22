import { Response } from 'express';

export const ok = (res: Response, data: unknown): void => {
  res.status(200).json(data);
};

export const created = (res: Response, data: unknown): void => {
  res.status(201).json(data);
};

export const noContent = (res: Response): void => {
  res.status(204).send();
};

export const badRequest = (res: Response, message?: string): void => {
  res.status(400).json({ message: message || 'Bad request' });
};

export const notFound = (res: Response, message?: string): void => {
  res.status(404).json({ message: message || 'Not found' });
};

export const conflict = (res: Response, message?: string): void => {
  res.status(409).json({ message: message || 'Conflict' });
};

export const serverError = (res: Response, message?: string): void => {
  res.status(500).json({ message: message || 'Internal server error' });
};

