import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/core/errors/app.error.interface';
import { AuthServiceInterface } from '@/core/services/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/core/services/password/password.service.interface';
import { UserRepositoryInterface } from '@/gateways/database/repositories/userRepository/user.repository.interface';
import { LoggerServiceInterface } from '@/gateways/logger/logger.service.interface';

import { AppError } from '@/core/errors/app.error';
import { TYPES } from '@/infrastructure/di/types';

import { LoginUseCaseInterface } from './login.useCase.interface';

@injectable()
export class LoginUseCase implements LoginUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.AuthService) private authService: AuthServiceInterface,
    @inject(TYPES.LoggerService) private loggerService: LoggerServiceInterface,
  ) {}

  async executeLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.loggerService.debug(`Login failed: User not found with email ${email}`);
      throw new AppError({ message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND });
    }

    const goodPassword = await this.passwordService.comparePassword(password, user.password);
    if (!goodPassword) {
      this.loggerService.debug(
        `Login failed: Password does not match for user with email ${email}`,
      );
      throw new AppError({ message: 'Invalid password', code: AppErrorCodes.BAD_PASSWORD });
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    this.loggerService.debug(`Login successful: User with email ${email} logged in`);
    return { accessToken, refreshToken };
  }
}