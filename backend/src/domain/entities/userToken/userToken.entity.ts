import { UserTokenInterface, UserTokenType } from './userToken.entity.interface';

export class UserToken implements UserTokenInterface {
  constructor(
    public id: string,
    public userId: string,
    public value: string,
    public canBeRefreshed: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public tokenType: UserTokenType,
    public expirationDate: Date,
  ) {}
}
