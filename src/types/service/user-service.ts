export interface IUserDto {
  id: number;
  email: string;
  isActivated: boolean;
}

interface IUser {
  id: number;
  email: string;
  isActivated: boolean;
}

export interface IReturnRegistration {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IGetUsers {
  id: number;
  email: string;
  password: string;
  is_activated: boolean;
  activation_link: string;
}

export interface IUserData {
  email: string;
  id: number;
  isActivated: boolean;
  iat: number;
  exp: number;
}

export interface ITokenFromDb {
  user_id: number;
  refresh_token: string;
}
