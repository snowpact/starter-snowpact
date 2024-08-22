import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { RefreshUseCaseInterface } from './refresh.useCase.interface';

@injectable()
export class RefreshUseCase implements RefreshUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.AuthService) private authService: AuthServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async executeRefresh(
    accessToken: string,
    refreshTokenValue: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId } = await this.authService.verifyAccessToken(accessToken, true);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { userId },
      });
    }

    const refreshToken = await this.userTokenRepository.findByTokenValue(refreshTokenValue);
    const validatedToken = this.authService.verifyRefreshToken({
      token: refreshToken,
      tokenValue: refreshTokenValue,
      userId,
    });

    const newAccessToken = await this.authService.generateAccessToken(userId);
    const newRefreshTokenValue = v4();
    await this.userTokenRepository.update({
      oldTokenValue: validatedToken.value,
      newTokenValue: newRefreshTokenValue,
      expirationDate: new Date(Date.now() + 1000 * this.envConfig.refreshTokenExpiration),
    });

    this.loggerService.debug(`Refresh successful: New tokens generated for user ${userId}`);
    return { accessToken: newAccessToken, refreshToken: newRefreshTokenValue };
  }
}
