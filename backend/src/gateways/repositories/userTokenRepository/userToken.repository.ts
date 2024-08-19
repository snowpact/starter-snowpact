import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';

import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { UserTokenSchema } from '@/gateways/helpers/database/schema/token.schema';

import {
  UserTokenRepositoryInterface,
  UpdateOptions,
} from '../../../domain/interfaces/repositories/userToken.repository.interface';

@injectable()
export class UserTokenRepository implements UserTokenRepositoryInterface {
  private repository: Repository<UserTokenInterface>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(UserTokenSchema);
  }
  create = async (token: UserTokenInterface): Promise<void> => {
    await this.repository.save(token);
  };
  findByTokenValue = async (tokenValue: string): Promise<UserTokenInterface | null> => {
    return this.repository.findOne({ where: { value: tokenValue } });
  };
  delete = async (tokenValue: string): Promise<void> => {
    await this.repository.delete({ value: tokenValue });
  };
  update = async ({
    oldTokenValue,
    newTokenValue,
    expirationDate,
  }: UpdateOptions): Promise<void> => {
    await this.repository.update(
      { value: oldTokenValue },
      { value: newTokenValue, expirationDate },
    );
  };
}
