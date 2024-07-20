import { faker } from '@faker-js/faker';
import { describe, beforeEach, it, vi, expect } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AccountTokenType } from '@/application/services/accountToken/accountToken.service.interface';

import { userFactory } from '@/application/entities/user/user.factory';
import { AppError } from '@/application/errors/app.error';

import { getAccountTokenServiceMock } from '@/application/services/accountToken/accountToken.service.mock';
import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getUserRepositoryMock } from '@/infrastructure/repositories/userRepository/user.repository.mock';
import { getLoggerServiceMock } from '@/infrastructure/services/logger/logger.service.mock';
import { getSendResetPasswordEmailServiceMock } from '@/infrastructure/services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service.mock';

import { ResetPasswordUseCase } from './resetPassword.useCase';

describe('ResetPasswordUseCase', () => {
  const accountTokenService = getAccountTokenServiceMock();
  const sendResetPasswordEmailService = getSendResetPasswordEmailServiceMock();
  const userRepository = getUserRepositoryMock();
  const passwordService = getPasswordServiceMock();
  const loggerService = getLoggerServiceMock();
  const loginUseCase = new ResetPasswordUseCase(
    accountTokenService,
    sendResetPasswordEmailService,
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
        type: AccountTokenType.RESET_PASSWORD,
      });
      expect(sendResetPasswordEmailService.sendResetPasswordEmail).toHaveBeenCalledWith({
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
      const token = faker.string.alphanumeric(30);
      const newPassword = faker.internet.password();
      const hashedPassword = faker.string.alphanumeric(30);
      accountTokenService.verifyAccountToken.mockResolvedValue({
        userId: user.id,
        type: AccountTokenType.RESET_PASSWORD,
      });
      userRepository.findById.mockResolvedValue(user);
      passwordService.hashPassword.mockResolvedValue(hashedPassword);
      passwordService.checkPasswordComplexity.mockReturnValue(true);

      await loginUseCase.executeResetPassword(token, newPassword);

      expect(accountTokenService.verifyAccountToken).toHaveBeenCalledWith(token);
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.updateOne).toHaveBeenCalledWith(user.id, { password: hashedPassword });
    });
    it('should throw an error if token has invalid type', async () => {
      accountTokenService.verifyAccountToken.mockResolvedValue({
        userId: faker.string.uuid(),
        type: AccountTokenType.VERIFY_ACCOUNT,
      });

      await expect(
        loginUseCase.executeResetPassword(faker.string.alphanumeric(30), faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if token is invalid', async () => {
      accountTokenService.verifyAccountToken.mockImplementation(() => {
        throw new AppError({ message: 'Invalid token', code: AppErrorCodes.INVALID_DATA_PROVIDED });
      });

      await expect(
        loginUseCase.executeResetPassword(faker.string.alphanumeric(30), faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if password is invalid', async () => {
      accountTokenService.verifyAccountToken.mockResolvedValue({
        userId: faker.string.uuid(),
        type: AccountTokenType.RESET_PASSWORD,
      });
      passwordService.checkPasswordComplexity.mockReturnValue(false);

      await expect(
        loginUseCase.executeResetPassword(faker.string.alphanumeric(30), faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if user not found', async () => {
      const token = faker.string.alphanumeric(30);
      accountTokenService.verifyAccountToken.mockResolvedValue({
        userId: faker.string.uuid(),
        type: AccountTokenType.RESET_PASSWORD,
      });
      passwordService.checkPasswordComplexity.mockReturnValue(true);
      userRepository.findById.mockResolvedValue(undefined);

      await expect(
        loginUseCase.executeResetPassword(token, faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
  });
});
