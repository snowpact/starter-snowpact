import { describe, beforeEach, it, expect, vi } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { getUserTokenServiceMock } from '@/application/services/userToken/userToken.service.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';
import { getUserRepositoryMock } from '@/gateways/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/gateways/repositories/userTokenRepository/userToken.repository.mock';

import { ValidateAccountUseCase } from './validateAccount.useCase';

describe('ValidateAccountUseCase', () => {
  const userTokenService = getUserTokenServiceMock();
  const userRepository = getUserRepositoryMock();
  const userTokenRepository = getUserTokenRepositoryMock();
  const loggerService = getLoggerMock();

  const validateAccountUseCase = new ValidateAccountUseCase(
    userRepository,
    userTokenRepository,
    userTokenService,
    loggerService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeValidateAccount', () => {
    it('should validate account successfully', async () => {
      const user = userFactory({ emailVerified: false });
      const token = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
      });

      userTokenRepository.findByTokenValue.mockResolvedValue(token);
      userTokenService.verifyToken.mockReturnValue(token);
      userRepository.findById.mockResolvedValue(user);

      await validateAccountUseCase.executeValidateAccount(token.value);

      expect(userTokenRepository.findByTokenValue).toHaveBeenCalledWith(token.value);
      expect(userTokenService.verifyToken).toHaveBeenCalledWith({
        token,
        tokenValue: token.value,
        tokenType: UserTokenTypeEnum.accountValidation,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(userRepository.updateOne).toHaveBeenCalledWith(user.id, { emailVerified: true });
      expect(userTokenRepository.deleteUserTokens).toHaveBeenCalledWith(user.id, [
        UserTokenTypeEnum.accountValidation,
      ]);
      expect(loggerService.debug).toHaveBeenCalledWith('Account validated successfully', {
        userId: user.id,
      });
    });

    it('should throw an error if token is invalid', async () => {
      const tokenValue = 'invalid-token';

      userTokenRepository.findByTokenValue.mockResolvedValue(null);

      await expect(validateAccountUseCase.executeValidateAccount(tokenValue)).rejects.toThrow(
        new AppError({
          message: 'Invalid token',
          code: AppErrorCodes.INVALID_TOKEN,
          privateContext: { tokenValue },
        }),
      );
    });

    it('should throw an error if user is not found', async () => {
      const token = userTokenFactory({ tokenType: UserTokenTypeEnum.accountValidation });

      userTokenRepository.findByTokenValue.mockResolvedValue(token);
      userTokenService.verifyToken.mockReturnValue(token);
      userRepository.findById.mockResolvedValue(null);

      await expect(validateAccountUseCase.executeValidateAccount(token.value)).rejects.toThrow(
        new AppError({
          message: 'User not found',
          code: AppErrorCodes.USER_NOT_FOUND,
          privateContext: { userId: token.userId },
        }),
      );
    });

    it('should throw an error if account is already validated', async () => {
      const user = userFactory({ emailVerified: true });
      const token = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
      });

      userTokenRepository.findByTokenValue.mockResolvedValue(token);
      userTokenService.verifyToken.mockReturnValue(token);
      userRepository.findById.mockResolvedValue(user);

      await expect(validateAccountUseCase.executeValidateAccount(token.value)).rejects.toThrow(
        new AppError({
          message: 'Account already validated',
          code: AppErrorCodes.ACCOUNT_ALREADY_VALIDATED,
          privateContext: { userId: user.id },
        }),
      );
    });
  });
});
