import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { RefreshUseCaseInterface } from './refresh.useCase.interface';

@injectable()
export class RefreshUseCase implements RefreshUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.AuthService) private authService: AuthServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
  ) {}

  async executeRefresh(
    accessToken: string,
    refreshToken: string,
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

    const newRefreshToken = await this.authService.refreshToken(refreshToken, userId);
    const newAccessToken = await this.authService.generateAccessToken(userId);

    this.loggerService.debug(`Refresh successful: New tokens generated for user ${userId}`);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
