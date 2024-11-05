import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ResetPasswordUseCaseInterface } from './resetPassword.useCase.interface';

@injectable()
export class ResetPasswordUseCase implements ResetPasswordUseCaseInterface {
  constructor(
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfig,
  ) {}

  async executeResetPasswordRequest(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { email },
      });
    }

    const token = this.userTokenService.generateToken({
      userId: user.id,
      tokenType: UserTokenTypeEnum.resetPassword,
      canBeRefreshed: false,
      expiresIn: this.envConfig.accountTokenExpiration,
    });

    await this.userTokenRepository.create(token);

    await this.mailSender.sendResetPasswordEmail({
      email,
      tokenValue: token.value,
    });

    this.loggerService.debug(`Ask reset password success: User found with email`, { email });
  }

  async executeResetPassword(tokenValue: string, newPassword: string): Promise<void> {
    const token = await this.userTokenRepository.findByTokenValue(tokenValue);
    const verifiedToken = this.userTokenService.verifyToken({
      token,
      tokenValue,
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

    const user = await this.userRepository.findById(verifiedToken.userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { userId: verifiedToken.userId },
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.updateOne(user.id, { password: hashedPassword });
    await this.userTokenRepository.deleteUserTokens(user.id, [
      UserTokenTypeEnum.resetPassword,
      UserTokenTypeEnum.refreshToken,
    ]);
    this.loggerService.debug(`Reset password success: User found with id ${verifiedToken.userId}`);
  }
}
