import { describe, beforeAll, it, expect } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { testDbService } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';

import { UserRepositoryInterface } from '../../../domain/interfaces/repositories/user.repository.interface';

describe('User Repository', () => {
  let userRepository: UserRepositoryInterface;
  beforeAll(() => {
    userRepository = mainContainer.get<UserRepositoryInterface>(TYPES.UserRepository);
  });
  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mainUser = userFactory();
      await Promise.all([
        testDbService.persistUser(mainUser),
        testDbService.persistUser(userFactory()),
        testDbService.persistUser(userFactory()),
      ]);

      const dbUser = await userRepository.findByEmail(mainUser.email);

      expect(dbUser?.id).toEqual(mainUser.id);
    });
    it('should return user even if email has not the same case', async () => {
      const email = 'user@example.com';
      const emailWithDifferentCase = 'User@ExamplE.Com';
      const user = userFactory({ email });
      await Promise.all([
        testDbService.persistUser(user),
        testDbService.persistUser(userFactory()),
        testDbService.persistUser(userFactory()),
      ]);

      const dbUser = await userRepository.findByEmail(emailWithDifferentCase);

      expect(dbUser?.id).toEqual(user.id);
    });
    it('should return null if user not found', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);

      const dbUser = await userRepository.findByEmail('not-found-email');

      expect(dbUser).toBeNull();
    });
  });
  describe('updateOne', () => {
    it('should update a user', async () => {
      const user = userFactory({ password: 'old-password' });
      await testDbService.persistUser(user);

      await userRepository.updateOne(user.id, { password: 'new-password' });

      const dbUser = await testDbService.getUser(user.id);

      expect(dbUser).toBeDefined();
      expect(dbUser?.password).toBe('new-password');
    });
  });
  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);

      const dbUser = await userRepository.findById(user.id);

      expect(dbUser).toBeDefined();
      expect(dbUser?.id).toEqual(user.id);
    });
    it('should return undefined if user not found', async () => {
      const user = userFactory();
      const dbUser = await userRepository.findById(user.id);

      expect(dbUser).toBeNull();
    });
  });
  describe('create', () => {
    it('should create a user', async () => {
      const user = userFactory();

      await userRepository.create(user);

      const dbUser = await testDbService.getUser(user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser?.id).toEqual(user.id);
    });
  });
});
