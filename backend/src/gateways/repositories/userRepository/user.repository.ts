import { inject, injectable } from 'inversify';
import { Repository, ILike } from 'typeorm';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { UserSchema } from '@/gateways/helpers/database/schema/user.schema';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private repository: Repository<UserInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(UserSchema);
  }
  async findById(id: string): Promise<UserInterface | null> {
    return this.repository.findOne({ where: { id } });
  }
  async updateOne(id: string, data: Partial<UserInterface>): Promise<void> {
    await this.repository.update(id, data);
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    return this.repository.findOne({ where: { email: ILike(email) } });
  }
  async create(user: UserInterface): Promise<void> {
    await this.repository.save(user);
  }
}
