import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { LoginUseCaseInterface } from './login.useCase.interface';

@injectable()
export class LoginUseCase implements LoginUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.AuthService) private authService: AuthServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
  ) {}

  async executeLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { email },
      });
    }

    const goodPassword = await this.passwordService.comparePassword(password, user.password);
    if (!goodPassword) {
      throw new AppError({
        message: 'Invalid password',
        code: AppErrorCodes.BAD_PASSWORD,
        privateContext: { email },
      });
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);

    this.loggerService.debug(`Login successful: User logged in`, { email });
    return { accessToken, refreshToken: refreshToken.value };
  }
}
