import { TokenInterface, TokenType } from './token.entity.interface';

export class Token implements TokenInterface {
  constructor(
    public id: string,
    public userId: string,
    public value: string,
    public canBeRefreshed: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public tokenType: TokenType,
    public expirationDate: Date,
  ) {}
}
