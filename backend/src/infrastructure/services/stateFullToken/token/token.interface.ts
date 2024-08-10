export enum TokenTypeEnum {
  accountValidation = 'accountValidation',
  resetPassword = 'resetPassword',
  refreshToken = 'refreshToken',
}

export type TokenType = TokenTypeEnum;
export const TokenTypeValues = Object.values(TokenTypeEnum) as [TokenType, ...TokenType[]];

export interface TokenInterface {
  id: string;
  userId: string;
  value: string;
  canBeRefreshed: boolean;
  tokenType: TokenType;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
}
