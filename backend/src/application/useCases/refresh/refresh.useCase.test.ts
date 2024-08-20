import { describe, beforeEach, expect, it, vi } from 'vitest';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { getAuthServiceMock } from '@/application/services/authToken/authToken.service.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';
import { getUserRepositoryMock } from '@/gateways/repositories/userRepository/user.repository.mock';

import { RefreshUseCase } from './refresh.useCase';

describe('RefreshUseCase', () => {
  const userRepository = getUserRepositoryMock();
  const authService = getAuthServiceMock();
  const loggerService = getLoggerMock();
  const refreshUseCase = new RefreshUseCase(userRepository, authService, loggerService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return new access and refresh tokens', async () => {
    const user = userFactory();
    const oldAccessToken = 'old_access_token';
    const oldRefreshToken = 'old_refresh_token';
    const newAccessToken = 'new_access_token';
    const newRefreshToken = 'new_refresh_token';

    authService.verifyAccessToken.mockResolvedValue({ userId: user.id });
    userRepository.findById.mockResolvedValue(user);
    authService.refreshToken.mockResolvedValue(newRefreshToken);
    authService.generateAccessToken.mockResolvedValue(newAccessToken);

    const { accessToken, refreshToken } = await refreshUseCase.executeRefresh(
      oldAccessToken,
      oldRefreshToken,
    );

    expect(accessToken).toBe(newAccessToken);
    expect(refreshToken).toBe(newRefreshToken);

    expect(authService.verifyAccessToken).toHaveBeenCalledWith(oldAccessToken, true);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(authService.refreshToken).toHaveBeenCalledWith(oldRefreshToken, user.id);
    expect(authService.generateAccessToken).toHaveBeenCalledWith(user.id);
  });

  it('should throw an error if user not found', async () => {
    authService.verifyAccessToken.mockResolvedValue({ userId: 'non_existent_id' });
    userRepository.findById.mockResolvedValue(null);

    await expect(
      refreshUseCase.executeRefresh('valid_access_token', 'refresh_token'),
    ).rejects.toThrow(AppError);
  });
});
