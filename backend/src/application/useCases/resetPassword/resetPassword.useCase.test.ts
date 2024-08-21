import { faker } from '@faker-js/faker';
import { describe, beforeEach, it, vi, expect } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';
import { EnvConfig } from '@/gateways/envConfig/envConfig';

import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getUserTokenServiceMock } from '@/application/services/userToken/userToken.service.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';
import { getMailSenderMock } from '@/gateways/mailSender/mailSender.mock';
import { getUserRepositoryMock } from '@/gateways/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/gateways/repositories/userTokenRepository/userToken.repository.mock';

import { ResetPasswordUseCase } from './resetPassword.useCase';

describe('ResetPasswordUseCase', () => {
  const userTokenService = getUserTokenServiceMock();
  const mailSender = getMailSenderMock();
  const userRepository = getUserRepositoryMock();
  const userTokenRepository = getUserTokenRepositoryMock();
  const passwordService = getPasswordServiceMock();
  const loggerService = getLoggerMock();
  const envConfig = new EnvConfig();

  const resetPasswordUseCase = new ResetPasswordUseCase(
    userTokenService,
    mailSender,
    userRepository,
    userTokenRepository,
    passwordService,
    loggerService,
    envConfig,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeResetPasswordRequest', () => {
    it('should send an email with a reset password link', async () => {
      const user = userFactory();
      const token = userTokenFactory({ userId: user.id });
      userRepository.findByEmail.mockResolvedValue(user);
      userTokenService.generateToken.mockReturnValue(token);

      await resetPasswordUseCase.executeResetPasswordRequest(user.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(userTokenService.generateToken).toHaveBeenCalledWith({
        userId: user.id,
        tokenType: UserTokenTypeEnum.resetPassword,
        canBeRefreshed: false,
        expiresIn: envConfig.accountTokenExpiration,
      });
      expect(mailSender.sendResetPasswordEmail).toHaveBeenCalledWith({
        email: user.email,
        tokenValue: token.value,
      });
    });
    it('should throw an error if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        resetPasswordUseCase.executeResetPasswordRequest(faker.internet.email()),
      ).rejects.toThrow();
    });
  });

  describe('executeResetPassword', () => {
    it('should reset password', async () => {
      const user = userFactory();
      const token = userTokenFactory({ userId: user.id });
      const newPassword = faker.internet.password();
      const hashedPassword = faker.string.alphanumeric(30);

      userTokenRepository.findByTokenValue.mockResolvedValue(token);
      userTokenService.verifyToken.mockReturnValue(token);
      userRepository.findById.mockResolvedValue(user);
      passwordService.hashPassword.mockResolvedValue(hashedPassword);
      passwordService.checkPasswordComplexity.mockReturnValue(true);

      await resetPasswordUseCase.executeResetPassword(token.value, newPassword);

      expect(userTokenService.verifyToken).toHaveBeenCalledWith({
        token,
        tokenValue: token.value,
        tokenType: UserTokenTypeEnum.resetPassword,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.updateOne).toHaveBeenCalledWith(user.id, { password: hashedPassword });
      expect(userTokenRepository.deleteUserTokens).toHaveBeenCalledWith(user.id, [
        UserTokenTypeEnum.resetPassword,
        UserTokenTypeEnum.refreshToken,
      ]);
    });

    it('should throw an error if password is invalid', async () => {
      const token = userTokenFactory();
      userTokenService.verifyToken.mockReturnValue(token);
      passwordService.checkPasswordComplexity.mockReturnValue(false);

      await expect(
        resetPasswordUseCase.executeResetPassword(token.value, faker.internet.password()),
      ).rejects.toThrow(AppError);
    });

    it('should throw an error if user not found', async () => {
      const token = userTokenFactory();
      userTokenService.verifyToken.mockReturnValue(token);
      passwordService.checkPasswordComplexity.mockReturnValue(true);
      userRepository.findById.mockResolvedValue(null);

      await expect(
        resetPasswordUseCase.executeResetPassword(token.value, faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
  });
});
