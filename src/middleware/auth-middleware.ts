import { Request, Response, NextFunction } from "express";

import ApiError from "../exceptions/api-error";
import tokenService from "../service/token-service";

export default async function (req: any, res: Response, next: NextFunction) {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken: string | undefined = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = await tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}
