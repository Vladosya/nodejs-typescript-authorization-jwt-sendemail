import { IModel } from "../types/dtos/user-dto";

export default class UserDto {
  id: number;
  email: string;
  isActivated: boolean;

  constructor(model: IModel) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.is_activated;
  }
}
