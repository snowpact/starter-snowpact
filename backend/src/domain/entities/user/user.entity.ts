import { UserInterface } from './user.entity.interface';
import { UserToken } from '../userToken/userToken.entity';

export class User implements UserInterface {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public admin: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public userTokens: UserToken[],
  ) {}
}
