import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/core/errors/app.error.interface';
import { UserRepositoryInterface } from '@/gateways/database/repositories/userRepository/user.repository.interface';
import { LoggerServiceInterface } from '@/gateways/logger/logger.service.interface';

import { User } from '@/core/entities/user/user.entity';
import { AppError } from '@/core/errors/app.error';
import { TYPES } from '@/infrastructure/di/types';

import { GetUserUseCaseInterface, ExecuteGetUserOptions } from './getUser.useCase.interface';

@injectable()
export class GetUserUseCase implements GetUserUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.LoggerService) private loggerService: LoggerServiceInterface,
  ) {}
  async executeGetUser({ currentUserId, userId }: ExecuteGetUserOptions): Promise<User> {
    const isSameUser = currentUserId === userId;
    const currentUser = await this.userRepository.findById(currentUserId);
    if (!currentUser) {
      this.loggerService.debug('Current user not found', { currentUserId });
      throw new AppError({
        code: AppErrorCodes.CURRENT_USER_NOT_FOUND,
        message: 'Current user not found',
      });
    }

    if (!currentUser.admin && !isSameUser) {
      this.loggerService.debug('User not allowed to access this user', { currentUserId, userId });
      throw new AppError({
        code: AppErrorCodes.CURRENT_USER_NOT_ALLOWED,
        message: 'User not allowed to access this user',
      });
    }

    const user = isSameUser ? currentUser : await this.userRepository.findById(userId);
    if (!user) {
      this.loggerService.debug('User not found ', { userId });
      throw new AppError({
        code: AppErrorCodes.USER_NOT_FOUND,
        message: 'User not found',
      });
    }
    this.loggerService.debug('User found', { userId });
    return user;
  }
}
