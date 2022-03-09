import { Request, Response, NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

import { IUserDto } from "../types/controllers/user-controller";

import UserService from "../service/user-service";
import ApiError from "../exceptions/api-error";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
      }
      const { email, password } = req.body;
      const userData: IUserDto = await UserService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({
        status: 200,
        message: "Пользователь успешно зарегистрирован",
        result: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({
        status: 200,
        message: "Пользователь успешно авторизовался",
        result: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({
        status: token === 1 ? 200 : 400,
        message: token === 1 ? "Пользователь успешно вышел" : "Ошибка выхода с аккаунта",
        result: token === 1 ? true : false,
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink: string = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect("https://yandex.ru");
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({
        status: 200,
        message: "Токен успешно обновлён",
        result: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await UserService.getUsers();
      return res.status(200).json({
        status: 200,
        message: "Успешное получение пользователей",
        result: userData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
