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

import { ResetPasswordUseCase } from './resetPassword.useCase';

describe('ResetPasswordUseCase', () => {
  const userTokenService = getUserTokenServiceMock();
  const mailSender = getMailSenderMock();
  const userRepository = getUserRepositoryMock();
  const passwordService = getPasswordServiceMock();
  const loggerService = getLoggerMock();
  const envConfig = new EnvConfig();
  const loginUseCase = new ResetPasswordUseCase(
    userTokenService,
    mailSender,
    userRepository,
    passwordService,
    loggerService,
    envConfig,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeAskResetPassword', () => {
    it('should send an email with a reset password link', async () => {
      const user = userFactory();
      const token = faker.string.alphanumeric(30);
      userRepository.findByEmail.mockResolvedValue(user);
      userTokenService.generateToken.mockResolvedValue(token);

      await loginUseCase.executeAskResetPassword(user.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(userTokenService.generateToken).toHaveBeenCalledWith({
        userId: user.id,
        tokenType: UserTokenTypeEnum.resetPassword,
        canBeRefreshed: false,
        expiresIn: envConfig.accountTokenExpiration,
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
      userTokenService.verifyToken.mockResolvedValue(userTokenFactory({ userId: user.id }));
      userRepository.findById.mockResolvedValue(user);
      passwordService.hashPassword.mockResolvedValue(hashedPassword);
      passwordService.checkPasswordComplexity.mockReturnValue(true);

      await loginUseCase.executeResetPassword(tokenValue, newPassword);

      expect(userTokenService.verifyToken).toHaveBeenCalledWith({
        tokenValue,
        tokenType: UserTokenTypeEnum.resetPassword,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.updateOne).toHaveBeenCalledWith(user.id, { password: hashedPassword });
    });
    it('should throw an error if password is invalid', async () => {
      userTokenService.verifyToken.mockResolvedValue(
        userTokenFactory({ userId: faker.string.uuid() }),
      );
      passwordService.checkPasswordComplexity.mockReturnValue(false);

      await expect(
        loginUseCase.executeResetPassword(faker.string.alphanumeric(30), faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if user not found', async () => {
      const token = faker.string.alphanumeric(30);
      userTokenService.verifyToken.mockResolvedValue(
        userTokenFactory({ userId: faker.string.uuid() }),
      );
      passwordService.checkPasswordComplexity.mockReturnValue(true);
      userRepository.findById.mockResolvedValue(undefined);

      await expect(
        loginUseCase.executeResetPassword(token, faker.internet.password()),
      ).rejects.toThrow(AppError);
    });
  });
});
