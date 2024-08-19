import { UserTokenInterface } from '../userToken/userToken.entity.interface';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
  userTokens: UserTokenInterface[];
}
