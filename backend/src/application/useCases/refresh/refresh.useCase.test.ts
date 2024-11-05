import { describe, beforeEach, expect, it, vi } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { getEnvConfigMock } from '@/adapters/envConfig/envConfig.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';
import { getAuthServiceMock } from '@/application/services/authToken/authToken.service.mock';

import { RefreshUseCase } from './refresh.useCase';

describe('RefreshUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const authServiceMock = getAuthServiceMock();
  const loggerServiceMock = getLoggerMock();
  const envConfigMock = getEnvConfigMock();
  const refreshUseCase = new RefreshUseCase(
    userRepositoryMock,
    userTokenRepositoryMock,
    authServiceMock,
    loggerServiceMock,
    envConfigMock,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return new access and refresh tokens', async () => {
    const user = userFactory();
    const oldAccessToken = 'old_access_token';
    const oldRefreshToken = userTokenFactory({ tokenType: UserTokenTypeEnum.refreshToken });
    const newAccessToken = 'new_access_token';

    authServiceMock.verifyAccessToken.mockResolvedValue({ userId: user.id });
    userRepositoryMock.findById.mockResolvedValue(user);
    authServiceMock.verifyRefreshToken.mockReturnValue(oldRefreshToken);
    authServiceMock.generateAccessToken.mockResolvedValue(newAccessToken);
    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(oldRefreshToken);

    const { accessToken, refreshToken } = await refreshUseCase.executeRefresh(
      oldAccessToken,
      oldRefreshToken.value,
    );

    expect(accessToken).toBe(newAccessToken);
    expect(refreshToken).not.toBe(oldRefreshToken.value);

    expect(authServiceMock.verifyAccessToken).toHaveBeenCalledWith(oldAccessToken, true);
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(user.id);
    expect(authServiceMock.verifyRefreshToken).toHaveBeenCalledWith({
      token: oldRefreshToken,
      tokenValue: oldRefreshToken.value,
      userId: user.id,
    });
    expect(authServiceMock.generateAccessToken).toHaveBeenCalledWith(user.id);
  });

  it('should throw an error if user not found', async () => {
    authServiceMock.verifyAccessToken.mockResolvedValue({ userId: 'non_existent_id' });
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      refreshUseCase.executeRefresh('valid_access_token', 'refresh_token'),
    ).rejects.toThrow(AppError);
  });
});
