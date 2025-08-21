import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Log error details
  console.error(`Error ${statusCode}: ${message}`);
  console.error(error.stack);

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};