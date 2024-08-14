import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';
import { envConfig } from '@/configuration/env/envConfig';

import { ResetPasswordUseCaseInterface } from './resetPassword.useCase.interface';

@injectable()
export class ResetPasswordUseCase implements ResetPasswordUseCaseInterface {
  constructor(
    @inject(TYPES.UserTokenService)
    private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
  ) {}

  async executeAskResetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { email },
      });
    }

    const token = await this.userTokenService.generateToken({
      userId: user.id,
      tokenType: UserTokenTypeEnum.resetPassword,
      canBeRefreshed: false,
      expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
    });

    try {
      await this.mailSender.sendResetPasswordEmail({
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
        privateContext: { email },
      });
    }

    this.loggerService.debug(`Ask reset password success: User found with email ${email}`);
  }

  async executeResetPassword(token: string, newPassword: string): Promise<void> {
    const { userId } = await this.userTokenService.verifyToken({
      tokenValue: token,
      tokenType: UserTokenTypeEnum.resetPassword,
    });

    const isValidPassword = this.passwordService.checkPasswordComplexity(newPassword);
    if (!isValidPassword) {
      throw new AppError({
        message: 'Invalid password complexity',
        code: AppErrorCodes.INVALID_PASSWORD_COMPLEXITY,
        privateContext: { token },
      });
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { userId },
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.updateOne(user.id, { password: hashedPassword });
    this.loggerService.debug(`Reset password success: User found with id ${userId}`);
  }
}
