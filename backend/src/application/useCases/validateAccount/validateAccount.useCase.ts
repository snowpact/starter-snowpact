import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ValidateAccountUseCaseInterface } from './validateAccount.useCase.interface';

@injectable()
export class ValidateAccountUseCase implements ValidateAccountUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeValidateAccount(tokenValue: string): Promise<void> {
    const token = await this.userTokenRepository.findByTokenValue(tokenValue);

    if (!token) {
      throw new AppError({
        message: 'Invalid token',
        code: AppErrorCodes.INVALID_TOKEN,
        privateContext: { tokenValue },
      });
    }

    const verifiedToken = this.userTokenService.verifyToken({
      token,
      tokenValue,
      tokenType: UserTokenTypeEnum.accountValidation,
    });

    const user = await this.userRepository.findById(verifiedToken.userId);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.USER_NOT_FOUND,
        privateContext: { userId: verifiedToken.userId },
      });
    }

    if (user.emailVerified) {
      throw new AppError({
        message: 'Account already validated',
        code: AppErrorCodes.ACCOUNT_ALREADY_VALIDATED,
        privateContext: { userId: user.id },
      });
    }

    await this.userRepository.updateOne(user.id, { emailVerified: true });
    await this.userTokenRepository.deleteUserTokens(user.id, [UserTokenTypeEnum.accountValidation]);

    this.logger.debug('Account validated successfully', { userId: user.id });
  }
}
