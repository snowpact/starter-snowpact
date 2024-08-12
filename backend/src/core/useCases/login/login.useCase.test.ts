import { faker } from '@faker-js/faker';
import { describe, beforeEach, expect, it, vi } from 'vitest';

import { userFactory } from '@/core/entities/user/user.factory';
import { AppError } from '@/core/errors/app.error';

import { getAuthServiceMock } from '@/core/services/authToken/authToken.service.mock';
import { getPasswordServiceMock } from '@/core/services/password/password.service.mock';
import { getUserRepositoryMock } from '@/gateways/database/repositories/userRepository/user.repository.mock';
import { getLoggerServiceMock } from '@/gateways/logger/logger.service.mock';

import { LoginUseCase } from './login.useCase';

describe('LoginUseCase', () => {
  const userRepository = getUserRepositoryMock();
  const passwordService = getPasswordServiceMock();
  const authService = getAuthServiceMock();
  const loggerService = getLoggerServiceMock();
  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordService,
    authService,
    loggerService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return access and refresh token', async () => {
    const clearPassword = faker.internet.password();
    const user = userFactory({ password: clearPassword });
    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.comparePassword.mockResolvedValue(true);
    authService.generateAccessToken.mockResolvedValue('access-token');
    authService.generateRefreshToken.mockResolvedValue('refresh-token');

    const { accessToken, refreshToken } = await loginUseCase.executeLogin(
      user.email,
      clearPassword,
    );

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
    expect(passwordService.comparePassword).toHaveBeenCalledWith(clearPassword, user.password);
    expect(authService.generateAccessToken).toHaveBeenCalledWith(user.id);
    expect(authService.generateRefreshToken).toHaveBeenCalledWith(user.id);
  });

  it('should throw an error if user not found', async () => {
    userRepository.findByEmail.mockResolvedValue(undefined);

    await expect(
      loginUseCase.executeLogin(faker.internet.email(), faker.internet.password()),
    ).rejects.toThrow(AppError);
  });

  it('should throw an error if password is invalid', async () => {
    const user = userFactory();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordService.comparePassword.mockResolvedValue(false);

    await expect(loginUseCase.executeLogin(user.email, user.password)).rejects.toThrow(AppError);
  });
});