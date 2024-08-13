import { faker } from '@faker-js/faker';
import { describe, beforeEach, it, vi, expect } from 'vitest';

import { TokenTypeEnum } from '@/domain/entities/token/token.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { getAccountTokenServiceMock } from '@/application/services/accountToken/accountToken.service.mock';
import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';
import { getMailSenderMock } from '@/gateways/mailSender/mailSender.mock';
import { getUserRepositoryMock } from '@/gateways/repositories/userRepository/user.repository.mock';

import { ResetPasswordUseCase } from './resetPassword.useCase';

describe('ResetPasswordUseCase', () => {
  const accountTokenService = getAccountTokenServiceMock();
  const mailSender = getMailSenderMock();
  const userRepository = getUserRepositoryMock();
  const passwordService = getPasswordServiceMock();
  const loggerService = getLoggerMock();
  const loginUseCase = new ResetPasswordUseCase(
    accountTokenService,
    mailSender,
    userRepository,
    passwordService,
    loggerService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeAskResetPassword', () => {
    it('should send an email with a reset password link', async () => {
      const user = userFactory();
      const token = faker.string.alphanumeric(30);
      userRepository.findByEmail.mockResolvedValue(user);
      accountTokenService.generateAccountToken.mockResolvedValue(token);

      await loginUseCase.executeAskResetPassword(user.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(accountTokenService.generateAccountToken).toHaveBeenCalledWith({
        userId: user.id,
        tokenType: TokenTypeEnum.resetPassword,
      });
      expect(mailSender.sendResetPasswordEmail).toHaveBeenCalledWith({
        email: user.email,
        token,
      });
    });
    it('should throw an error if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(undefined);

      await expect(loginUseCase.executeAskResetPassword(faker.internet.email())).rejects.toThrow();
    });
  });

  describe('executeResetPassword', () => {
    it('should reset password', async () => {
      const user = userFactory();
      const tokenValue = faker.string.alphanumeric(30);
      const newPassword = faker.internet.password();
      const hashedPassword = faker.string.alphanumeric(30);
      accountTokenService.verifyAccountToken.mockResolvedValue(user.id);
      userRepository.findById.mockResolvedValue(user);
      passwordService.hashPassword.mockResolvedValue(hashedPassword);
      passwordService.checkPasswordComplexity.mockReturnValue(true);

      await loginUseCase.executeResetPassword(tokenValue, newPassword);

      expect(accountTokenService.verifyAccountToken).toHaveBeenCalledWith({
        tokenValue,
        tokenType: TokenTypeEnum.resetPassword,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.updateOne).toHaveBeenCalledWith(user.id, { password: hashedPassword });
    });
    it('should throw an error if password is invalid', async () => {
      accountTokenService.verifyAccountToken.mockResolvedValue(faker.string.uuid());
      passwordService.checkPasswordComplexity.mockReturnValue(false);

      await expect(
        loginUseCase.executeResetPassword(faker.string.alphanumeric(30), faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if user not found', async () => {
      const token = faker.string.alphanumeric(30);
      accountTokenService.verifyAccountToken.mockResolvedValue(faker.string.uuid());
      passwordService.checkPasswordComplexity.mockReturnValue(true);
      userRepository.findById.mockResolvedValue(undefined);

      await expect(
        loginUseCase.executeResetPassword(token, faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
  });
});
