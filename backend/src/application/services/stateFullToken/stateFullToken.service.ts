import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { TokenInterface } from '@/domain/entities/token/token.interface';
import { TokenRepositoryInterface } from '@/domain/interfaces/repositories/token.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  GenerateTokenOptions,
  RefreshTokenOptions,
  StateFullTokenServiceInterface,
  VerifyTokenOptions,
} from './stateFullToken.service.interface';

@injectable()
export class StateFullTokenService implements StateFullTokenServiceInterface {
  constructor(@inject(TYPES.TokenRepository) private tokenRepository: TokenRepositoryInterface) {}

  async generateToken({
    userId,
    expiresIn,
    canBeRefreshed,
    tokenType,
  }: GenerateTokenOptions): Promise<string> {
    const tokenValue = v4();
    const token: TokenInterface = {
      id: v4(),
      userId,
      value: tokenValue,
      canBeRefreshed,
      createdAt: new Date(),
      updatedAt: new Date(),
      expirationDate: new Date(Date.now() + 1000 * expiresIn),
      tokenType,
    };

    await this.tokenRepository.create(token);

    return tokenValue;
  }
  async verifyToken({
    tokenValue,
    ignoreExpiration = false,
    tokenType,
    userId,
  }: VerifyTokenOptions): Promise<TokenInterface> {
    const token = await this.tokenRepository.findByTokenValue(tokenValue);

    if (!token) {
      throw new AppError({ code: AppErrorCodes.TOKEN_NOT_FOUND, message: 'Token not found' });
    }

    if (token.expirationDate < new Date() && !ignoreExpiration) {
      await this.tokenRepository.delete(tokenValue);
      throw new AppError({ code: AppErrorCodes.TOKEN_EXPIRED, message: 'Token expired' });
    }

    if (token.tokenType !== tokenType) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_TYPE_MISMATCH,
        message: 'Token type mismatch',
      });
    }

    if (userId && token.userId !== userId) {
      throw new AppError({
        code: AppErrorCodes.TOKEN_USER_ID_MISMATCH,
        message: 'Token user id mismatch',
      });
    }

    return token;
  }

  async removeToken(tokenValue: string): Promise<void> {
    await this.tokenRepository.delete(tokenValue);
  }

  async refreshToken({ tokenValue, expiresIn }: RefreshTokenOptions): Promise<string> {
    const newTokenValue = v4();

    const token = await this.tokenRepository.findByTokenValue(tokenValue);

    if (!token) {
      throw new AppError({ code: AppErrorCodes.TOKEN_NOT_FOUND, message: 'Token not found' });
    }

    await this.tokenRepository.update({
      oldTokenValue: tokenValue,
      newTokenValue,
      expirationDate: new Date(Date.now() + 1000 * expiresIn),
    });

    return newTokenValue;
  }
}
