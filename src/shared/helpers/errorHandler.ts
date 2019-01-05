import * as httpStatus from 'http-status';
import { Response, Request, NextFunction } from 'express';

// handle not found errors
export const notFound = (_req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    success: false,
    message: 'Requested Resource Not Found',
  });
  res.end();
};

// handle internal server errors
export const internalServerError = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err,
  });
  res.end();
};

// get error object with message
export const getNullErrorData = (errorMessage: string) => {
  return {
    success: false,
    message: errorMessage,
    data: null,
  };
};
