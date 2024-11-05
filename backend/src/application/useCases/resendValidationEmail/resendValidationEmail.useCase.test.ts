/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { getEnvConfigMock } from '@/adapters/envConfig/envConfig.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';
import { getUserTokenServiceMock } from '@/application/services/userToken/userToken.service.mock';

import { ResendValidationEmailUseCase } from './resendValidationEmail.useCase';

describe('ResendValidationEmailUseCase', () => {
  const userTokenService = getUserTokenServiceMock();
  const mailSender = getMailSenderMock();
  const userRepository = getUserRepositoryMock();
  const userTokenRepository = getUserTokenRepositoryMock();
  const loggerService = getLoggerMock();
  const envConfig = getEnvConfigMock();

  const resendValidationEmailUseCase = new ResendValidationEmailUseCase(
    userTokenService,
    mailSender,
    userRepository,
    userTokenRepository,
    loggerService,
    envConfig,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeResendValidationEmail', () => {
    it('should resend validation email when given a valid email', async () => {
      const user = userFactory({ emailVerified: false });
      const newToken = userTokenFactory({ userId: user.id });

      userRepository.findByEmail.mockResolvedValue(user);
      userTokenService.generateToken.mockReturnValue(newToken);

      await resendValidationEmailUseCase.executeResendValidationEmail({ email: user.email });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(userTokenService.generateToken).toHaveBeenCalled();
      expect(userTokenRepository.create).toHaveBeenCalledWith(newToken);
      expect(mailSender.sendRegisterEmail).toHaveBeenCalledWith({
        email: user.email,
        tokenValue: newToken.value,
      });
    });

    it('should resend validation email when given a valid token', async () => {
      const user = userFactory({ emailVerified: false });
      const oldToken = userTokenFactory({ userId: user.id });

      userTokenRepository.findByTokenValue.mockResolvedValue(oldToken);
      userTokenService.verifyToken.mockReturnValue(oldToken);
      userRepository.findById.mockResolvedValue(user);

      await resendValidationEmailUseCase.executeResendValidationEmail({ token: oldToken.value });

      expect(userTokenRepository.findByTokenValue).toHaveBeenCalledWith(oldToken.value);
      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
      expect(userTokenRepository.update).toHaveBeenCalledWith({
        oldTokenValue: oldToken.value,
        newTokenValue: expect.any(String),
        expirationDate: expect.any(Date),
      });
      expect(mailSender.sendRegisterEmail).toHaveBeenCalledWith({
        email: user.email,
        tokenValue: expect.any(String),
      });
    });

    it('should throw an error if neither email nor token is provided', async () => {
      await expect(resendValidationEmailUseCase.executeResendValidationEmail({})).rejects.toThrow(
        AppError,
      );
    });

    it('should throw an error if user is not found with provided email', async () => {
      const email = faker.internet.email();
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        resendValidationEmailUseCase.executeResendValidationEmail({ email }),
      ).rejects.toThrow(AppError);
    });

    it('should throw an error if email is already verified', async () => {
      const user = userFactory({ emailVerified: true });
      userRepository.findByEmail.mockResolvedValue(user);

      await expect(
        resendValidationEmailUseCase.executeResendValidationEmail({ email: user.email }),
      ).rejects.toThrow(AppError);
    });
  });
});
