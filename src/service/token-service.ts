import jwt from "jsonwebtoken";

import db from "../db";
import { IPayload, IReturnTokens, IFindToken } from "../types/service/token-service";

class TokenService {
  async generateToken(payload: IPayload): Promise<IReturnTokens> {
    const accessToken: string = jwt.sign(payload, "jwt-secret-key", { expiresIn: "60m" });
    const refreshToken: string = jwt.sign(payload, "jwt-refresh-key", { expiresIn: "30d" });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      const userData: any = jwt.verify(token, "jwt-secret-key");

      return userData;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token: string) {
    try {
      const userData: any = jwt.verify(token, "jwt-refresh-key");

      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(findToken: string): Promise<IFindToken[]> {
    const tokenData = await db.query("SELECT * FROM token WHERE refresh_token = $1", [findToken]);

    return tokenData.rows;
  }

  async saveToken(userId: number, refreshToken: string): Promise<void> {
    const tokenData = await db.query("SELECT * FROM token WHERE user_id = $1", [userId]);
    if (tokenData.rows.length > 0) {
      await db.query("UPDATE token set refresh_token = $1 WHERE user_id = $2", [
        refreshToken,
        userId,
      ]);
    } else {
      await db.query("INSERT INTO token (user_id, refresh_token) VALUES ($1, $2)", [
        userId,
        refreshToken,
      ]);
    }
  }

  async removeToken(refreshToken: string): Promise<number> {
    const token = await db.query("DELETE FROM token WHERE refresh_token = $1", [refreshToken]);

    return token.rowCount;
  }
}

export default new TokenService();
