import { describe, beforeAll, it, expect } from 'vitest';

import { userFactory } from '@/application/entities/user/user.factory';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { testDbHelper } from '@/tests/vitest.containers.setup';

import { UserRepositoryInterface } from './user.repository.interface';

describe('User Repository', () => {
  let userRepository: UserRepositoryInterface;
  beforeAll(() => {
    userRepository = mainContainer.get<UserRepositoryInterface>(TYPES.UserRepository);
  });
  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mainUser = userFactory();
      await Promise.all([
        testDbHelper.persistUser(mainUser),
        testDbHelper.persistUser(userFactory()),
        testDbHelper.persistUser(userFactory()),
      ]);

      const dbUser = await userRepository.findByEmail(mainUser.email);

      expect(dbUser?.id).toMatchObject(mainUser.id);
    });
    it('should return undefined if user not found', async () => {
      const user = userFactory();
      await testDbHelper.persistUser(user);

      const dbUser = await userRepository.findByEmail('not-found-email');

      expect(dbUser).toBeUndefined();
    });
  });
  describe('updateOne', () => {
    it('should update a user', async () => {
      const user = userFactory({ password: 'old-password' });
      await testDbHelper.persistUser(user);

      await userRepository.updateOne(user.id, { password: 'new-password' });

      const dbUser = await testDbHelper.getUser(user.id);

      expect(dbUser).toBeDefined();
      expect(dbUser?.password).toBe('new-password');
    });
  });
  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = userFactory();
      await testDbHelper.persistUser(user);

      const dbUser = await userRepository.findById(user.id);

      expect(dbUser).toBeDefined();
      expect(dbUser?.id).toMatchObject(user.id);
    });
    it('should return undefined if user not found', async () => {
      const user = userFactory();
      const dbUser = await userRepository.findById(user.id);

      expect(dbUser).toBeUndefined();
    });
  });
});
