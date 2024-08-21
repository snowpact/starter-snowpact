import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  GenerateTokenOptions,
  RefreshTokenOptions,
  UserTokenServiceInterface,
  VerifyTokenOptions,
} from './userToken.service.interface';

@injectable()
export class UserTokenService implements UserTokenServiceInterface {
  constructor(
    @inject(TYPES.UserTokenRepository)
    private userTokenRepository: UserTokenRepositoryInterface,
  ) {}

  async generateToken({
    userId,
    expiresIn,
    canBeRefreshed,
    tokenType,
  }: GenerateTokenOptions): Promise<string> {
    const tokenValue = v4();
    const token: UserTokenInterface = {
      id: v4(),
      userId,
      value: tokenValue,
      canBeRefreshed,
      createdAt: new Date(),
      updatedAt: new Date(),
      expirationDate: new Date(Date.now() + 1000 * expiresIn),
      tokenType,
    };

    await this.userTokenRepository.create(token);

    return tokenValue;
  }
  async verifyToken({
    tokenValue,
    ignoreExpiration = false,
    tokenType,
    userId,
  }: VerifyTokenOptions): Promise<UserTokenInterface> {
    const token = await this.userTokenRepository.findByTokenValue(tokenValue);

    if (!token) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        privateContext: { userId, tokenType, tokenValue, ignoreExpiration },
      });
    }

    if (token.expirationDate < new Date() && !ignoreExpiration) {
      await this.userTokenRepository.delete(tokenValue);
      throw new AppError({
        code: AppErrorCodes.TOKEN_EXPIRED,
        message: 'Token expired',
        privateContext: { userId, tokenType, tokenValue, ignoreExpiration },
      });
    }

    if (token.tokenType !== tokenType) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_TYPE_MISMATCH,
        message: 'Token type mismatch',
        privateContext: { userId, tokenType, tokenValue, ignoreExpiration },
      });
    }

    if (userId && token.userId !== userId) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_USER_ID_MISMATCH,
        message: 'Token user id mismatch',
        privateContext: { userId, tokenType, tokenValue, ignoreExpiration },
      });
    }

    return token;
  }

  async refreshToken({ tokenValue, expiresIn }: RefreshTokenOptions): Promise<string> {
    const newTokenValue = v4();

    const token = await this.userTokenRepository.findByTokenValue(tokenValue);

    if (!token) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_NOT_FOUND,
        message: 'Token not found',
        privateContext: { tokenValue },
      });
    }

    await this.userTokenRepository.update({
      oldTokenValue: tokenValue,
      newTokenValue,
      expirationDate: new Date(Date.now() + 1000 * expiresIn),
    });

    return newTokenValue;
  }
}
