import bcrypt from "bcrypt";
import { v4 } from "uuid";

import db from "../db";

import {
  IUserDto,
  IReturnRegistration,
  IGetUsers,
  IUserData,
  ITokenFromDb,
} from "../types/service/user-service";

import ApiError from "../exceptions/api-error";
import UserDto from "../dtos/user-dto";
import MailService from "./mail-service";
import TokenService from "./token-service";

class UserService {
  async registration(email: string, password: string): Promise<IReturnRegistration> {
    const candidate = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (candidate.rows.length > 0) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} уже существует`);
    }
    const hashPassword: string = bcrypt.hashSync(password, 3);
    const activationLink: string = v4();
    const user = await db.query(
      "INSERT INTO users (email, password, activation_link) VALUES ($1, $2, $3) RETURNING *",
      [email, hashPassword, activationLink],
    );
    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api-v1/activate/${activationLink}`,
    );

    const userDto: IUserDto = new UserDto(user.rows[0]);
    const tokens = await TokenService.generateToken({
      ...userDto,
    });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email: string, password: string): Promise<IReturnRegistration> {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} не найден`);
    }
    const isPassEquals: boolean = await bcrypt.compare(password, user.rows[0].password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неправильный логин или пароль");
    }
    const userDto: IUserDto = new UserDto(user.rows[0]);
    const tokens = await TokenService.generateToken({
      ...userDto,
    });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string): Promise<number> {
    const token = await TokenService.removeToken(refreshToken);

    return token;
  }

  async activate(activationLink: string): Promise<void> {
    const user = await db.query("SELECT * FROM users WHERE activation_link = $1", [activationLink]);
    if (!user.rows.length) {
      throw ApiError.BadRequest(`Неккоректная ссылка активации`);
    }

    await db.query("UPDATE users set is_activated = $1 WHERE activation_link = $2", [
      true,
      activationLink,
    ]);
  }

  async refresh(refreshToken: string): Promise<IReturnRegistration> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData: IUserData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb: ITokenFromDb[] = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userData.id]);
    const userDto: IUserDto = new UserDto(user.rows[0]);
    const tokens = await TokenService.generateToken({
      ...userDto,
    });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getUsers(): Promise<IGetUsers[]> {
    const users = await db.query("SELECT * FROM users");

    return users.rows;
  }
}

export default new UserService();
