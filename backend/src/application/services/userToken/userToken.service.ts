import { injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';

import {
  GenerateTokenOptions,
  UserTokenServiceInterface,
  VerifyTokenOptions,
} from './userToken.service.interface';

@injectable()
export class UserTokenService implements UserTokenServiceInterface {
  constructor() {}

  generateToken({
    userId,
    expiresIn,
    canBeRefreshed,
    tokenType,
  }: GenerateTokenOptions): UserTokenInterface {
    const tokenValue = v4();
    return {
      id: v4(),
      userId,
      value: tokenValue,
      canBeRefreshed,
      createdAt: new Date(),
      updatedAt: new Date(),
      expirationDate: new Date(Date.now() + 1000 * expiresIn),
      tokenType,
    };
  }
  verifyToken({
    token,
    tokenValue,
    ignoreExpiration = false,
    tokenType,
    userId,
  }: VerifyTokenOptions): UserTokenInterface {
    if (!token) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        privateContext: { userId, tokenType, tokenValue, ignoreExpiration },
      });
    }
    if (token.expirationDate < new Date() && !ignoreExpiration) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_EXPIRED,
        message: 'Token expired',
        privateContext: { userId, tokenType, token, ignoreExpiration },
      });
    }

    if (token.tokenType !== tokenType) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_TYPE_MISMATCH,
        message: 'Token type mismatch',
        privateContext: { userId, tokenType, token, ignoreExpiration },
      });
    }

    if (userId && token.userId !== userId) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_USER_ID_MISMATCH,
        message: 'Token user id mismatch',
        privateContext: { userId, tokenType, token, ignoreExpiration },
      });
    }

    return token;
  }
}
