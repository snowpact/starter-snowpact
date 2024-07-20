import { describe, beforeEach, vi, expect, it } from 'vitest';

import { userFactory } from '@/application/entities/user/user.factory';
import { AppError } from '@/application/errors/app.error';

import { getUserRepositoryMock } from '@/infrastructure/repositories/userRepository/user.repository.mock';
import { getLoggerServiceMock } from '@/infrastructure/services/logger/logger.service.mock';

import { GetUserUseCase } from './getUser.useCase';

describe('GetUserUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const loggerServiceMock = getLoggerServiceMock();
  const getUserUseCase = new GetUserUseCase(userRepositoryMock, loggerServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user - current user is admin', async () => {
    const currentUser = userFactory({ admin: true });
    const user = userFactory();
    userRepositoryMock.findById.mockResolvedValueOnce(currentUser);
    userRepositoryMock.findById.mockResolvedValueOnce(user);

    const responseUser = await getUserUseCase.executeGetUser({
      currentUserId: currentUser.id,
      userId: user.id,
    });

    expect(responseUser).toEqual(user);
  });
  it('should return user - current user is same as user and not admin', async () => {
    const currentUser = userFactory({ admin: false });
    userRepositoryMock.findById.mockResolvedValueOnce(currentUser);

    const responseUser = await getUserUseCase.executeGetUser({
      currentUserId: currentUser.id,
      userId: currentUser.id,
    });

    expect(responseUser).toEqual(currentUser);
  });
  it('should throw error - current user is different from user and not admin', async () => {
    const currentUser = userFactory({ admin: false });
    const user = userFactory();
    userRepositoryMock.findById.mockResolvedValueOnce(currentUser);
    userRepositoryMock.findById.mockResolvedValueOnce(user);

    await expect(
      getUserUseCase.executeGetUser({ currentUserId: currentUser.id, userId: user.id }),
    ).rejects.toThrow(AppError);
  });
  it('should throw error - current user not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(undefined);
    userRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(
      getUserUseCase.executeGetUser({ currentUserId: '1', userId: '2' }),
    ).rejects.toThrow(AppError);
  });
  it('should throw error - user not found', async () => {
    const currentUser = userFactory({ admin: true });
    userRepositoryMock.findById.mockResolvedValueOnce(currentUser);
    userRepositoryMock.findById.mockResolvedValueOnce(undefined);

    await expect(
      getUserUseCase.executeGetUser({ currentUserId: currentUser.id, userId: '2' }),
    ).rejects.toThrow(AppError);
  });
});
