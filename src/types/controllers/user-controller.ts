interface IUser {
  id: number;
  email: string;
  isActivated: boolean;
}

export interface IUserDto {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
