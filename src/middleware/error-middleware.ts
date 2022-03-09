import { Request, Response, NextFunction } from "express";

import ApiError from "../exceptions/api-error";

export default function (err: ApiError, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }
  return res.status(500).json({
    status: 500,
    message: "Произошла непредвиденная ошибка",
  });
}
