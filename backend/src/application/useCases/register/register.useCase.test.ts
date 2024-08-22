/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';
import { getMailSenderMock } from '@/gateways/mailSender/mailSender.mock';
import { getUserRepositoryMock } from '@/gateways/repositories/userRepository/user.repository.mock';

import { RegisterUseCase } from './register.useCase';

describe('RegisterUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const passwordServiceMock = getPasswordServiceMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();
  const registerUseCase = new RegisterUseCase(
    userRepositoryMock,
    passwordServiceMock,
    mailSenderMock,
    loggerMock,
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register a user', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const hashedPassword = faker.string.alphanumeric();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(true);
    passwordServiceMock.hashPassword.mockResolvedValue(hashedPassword);

    await registerUseCase.executeRegister(email, password);

    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      id: expect.any(String),
      email,
      password: hashedPassword,
      admin: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      userTokens: [],
    });
    expect(mailSenderMock.sendRegisterEmail).toHaveBeenCalledWith(email);
  });
  it('should throw an error - email already exists', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    userRepositoryMock.findByEmail.mockResolvedValue(userFactory());

    await expect(registerUseCase.executeRegister(email, password)).rejects.toThrow(AppError);
  });
  it('should throw an error - invalid password', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(false);

    await expect(registerUseCase.executeRegister(email, password)).rejects.toThrow(AppError);
  });
});
