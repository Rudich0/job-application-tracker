import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', err);

  // Postgres constraint violation
  if (err.code === '23514') {
    res.status(400).json({ error: 'Invalid enum value provided' });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ error: message });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
};
