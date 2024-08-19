import { UserInterface } from '../user/user.entity.interface';

export enum UserTokenTypeEnum {
  accountValidation = 'accountValidation',
  resetPassword = 'resetPassword',
  refreshToken = 'refreshToken',
}

export type UserTokenType = UserTokenTypeEnum;
export const UserTokenTypeValues = Object.values(UserTokenTypeEnum) as [
  UserTokenType,
  ...UserTokenType[],
];

export interface UserTokenInterface {
  id: string;
  userId: string;
  value: string;
  canBeRefreshed: boolean;
  tokenType: UserTokenType;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
  user?: UserInterface;
}
