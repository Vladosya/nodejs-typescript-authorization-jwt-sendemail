export interface IPayload {
  id: number;
  email: string;
  isActivated: boolean;
}

export interface IReturnTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IFindToken {
  user_id: number;
  refresh_token: string;
}
