import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from './errorHandler';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const apiError = new Error(JSON.stringify(errorMessages)) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const apiError = new Error(JSON.stringify(errorMessages)) as ApiError;
        apiError.statusCode = 400;
        throw apiError;
      }
      next(error);
    }
  };
};