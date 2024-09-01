import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import {
  UserTokenInterface,
  UserTokenTypeEnum,
} from '@/domain/entities/userToken/userToken.entity.interface';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ResendValidationEmailUseCaseInterface } from './resendValidationEmail.useCase.interface';

@injectable()
export class ResendValidationEmailUseCase implements ResendValidationEmailUseCaseInterface {
  constructor(
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async executeResendValidationEmail(params: { email?: string; token?: string }): Promise<void> {
    const { email, token } = params;

    const userToken = await this.getUserToken(token);
    const user = await this.getUser(email, userToken?.userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
      });
    }
    if (user.emailVerified) {
      throw new AppError({
        message: 'User already verified',
        code: AppErrorCodes.ACCOUNT_ALREADY_VALIDATED,
      });
    }

    const newToken = await this.generateAndSaveNewToken(user, userToken);

    await this.mailSender.sendRegisterEmail({
      email: user.email,
      tokenValue: newToken,
    });
    this.loggerService.debug(
      `Resend validation email successful: New token generated for user ${user.id}`,
    );
  }

  private async getUserToken(token?: string): Promise<UserTokenInterface | null> {
    if (!token) {
      return null;
    }

    const userToken = await this.userTokenRepository.findByTokenValue(token);

    const verifiedUserToken = this.userTokenService.verifyToken({
      token: userToken,
      tokenType: UserTokenTypeEnum.accountValidation,
      ignoreExpiration: true,
      tokenValue: token,
    });

    return verifiedUserToken;
  }

  private async getUser(email?: string, userId?: string): Promise<UserInterface | null> {
    if (email) {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } else if (userId) {
      const user = await this.userRepository.findById(userId);
      return user;
    }

    return null;
  }

  private async generateAndSaveNewToken(
    user: UserInterface,
    userToken: UserTokenInterface | null,
  ): Promise<string> {
    const newTokenValue = v4();
    if (userToken) {
      await this.userTokenRepository.update({
        oldTokenValue: userToken.value,
        newTokenValue,
        expirationDate: new Date(Date.now() + 1000 * this.envConfig.refreshTokenExpiration),
      });
    } else {
      const newUserToken = this.userTokenService.generateToken({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
        expiresIn: this.envConfig.accountTokenExpiration,
        canBeRefreshed: true,
      });
      newUserToken.value = newTokenValue;
      await this.userTokenRepository.create(newUserToken);
    }

    return newTokenValue;
  }
}
