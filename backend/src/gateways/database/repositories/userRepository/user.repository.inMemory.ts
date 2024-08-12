import { injectable } from 'inversify';

import { UserInterface } from '@/core/entities/user/user.entity.interface';

import { userFactory } from '@/core/entities/user/user.factory';

import { UserRepositoryInterface } from './user.repository.interface';

@injectable()
export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: UserInterface[] = [];

  constructor() {
    this.users = [
      userFactory({ id: '1', email: 'user1@example.com', password: 'password' }),
      userFactory({ id: '2', email: 'user2@example.com', password: 'password' }),
      userFactory({ id: '3', email: 'user3@example.com', password: 'password' }),
    ];
  }

  async findById(id: string): Promise<UserInterface | undefined> {
    const users = this.users.find((user) => user.id === id);
    return Promise.resolve(users);
  }

  async updateOne(id: string, data: Partial<UserInterface>): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...data };
    }
    return Promise.resolve();
  }

  async findByEmail(email: string): Promise<UserInterface | undefined> {
    const users = this.users.find((user) => user.email === email);
    return Promise.resolve(users);
  }
}
