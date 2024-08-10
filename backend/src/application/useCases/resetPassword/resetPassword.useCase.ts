import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AccountTokenServiceInterface } from '@/application/services/accountToken/accountToken.service.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserRepositoryInterface } from '@/infrastructure/repositories/userRepository/user.repository.interface';
import { LoggerServiceInterface } from '@/infrastructure/services/logger/logger.service.interface';
import { SendResetPasswordEmailServiceInterface } from '@/infrastructure/services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service.interface';
import { TokenTypeEnum } from '@/infrastructure/services/stateFullToken/token/token.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/infrastructure/di/types';

import { ResetPasswordUseCaseInterface } from './resetPassword.useCase.interface';

@injectable()
export class ResetPasswordUseCase implements ResetPasswordUseCaseInterface {
  constructor(
    @inject(TYPES.AccountTokenService) private accountTokenService: AccountTokenServiceInterface,
    @inject(TYPES.SendResetPasswordEmailService)
    private sendResetPasswordEmailService: SendResetPasswordEmailServiceInterface,
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.LoggerService) private loggerService: LoggerServiceInterface,
  ) {}

  async executeAskResetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.loggerService.debug(`Ask reset password failed: User not found with email ${email}`);
      throw new AppError({ message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND });
    }

    const token = await this.accountTokenService.generateAccountToken({
      userId: user.id,
      tokenType: TokenTypeEnum.resetPassword,
    });

    try {
      await this.sendResetPasswordEmailService.sendResetPasswordEmail({
        email,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.loggerService.error('Ask reset password failed', error);
      } else {
        this.loggerService.error(`Ask reset password failed`, new Error('Unknown error'));
      }
      throw new AppError({
        message: 'Failed to send reset password email',
        code: AppErrorCodes.FAILED_TO_SEND_EMAIL,
      });
    }

    this.loggerService.debug(`Ask reset password success: User found with email ${email}`);
  }

  async executeResetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.accountTokenService.verifyAccountToken({
      tokenValue: token,
      tokenType: TokenTypeEnum.resetPassword,
    });

    const isValidPassword = this.passwordService.checkPasswordComplexity(newPassword);
    if (!isValidPassword) {
      this.loggerService.debug(`Reset password failed: Invalid password complexity`);
      throw new AppError({
        message: 'Invalid password complexity',
        code: AppErrorCodes.INVALID_PASSWORD_COMPLEXITY,
      });
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.loggerService.debug(`Reset password failed: User not found with id ${userId}`);
      throw new AppError({ message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND });
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.updateOne(user.id, { password: hashedPassword });
    this.loggerService.debug(`Reset password success: User found with id ${userId}`);
  }
}
