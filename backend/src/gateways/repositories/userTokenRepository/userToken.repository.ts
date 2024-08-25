import { inject, injectable } from 'inversify';
import { In, Repository } from 'typeorm';

import {
  UserTokenInterface,
  UserTokenType,
} from '@/domain/entities/userToken/userToken.entity.interface';
import {
  UserTokenRepositoryInterface,
  UpdateTokenOptions,
} from '@/domain/interfaces/repositories/userToken.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { UserTokenSchema } from '@/infrastructure/database/schema/token.schema';

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
  deleteByValue = async (tokenValue: string): Promise<void> => {
    await this.repository.delete({ value: tokenValue });
  };
  deleteUserTokens = async (userId: string, tokenTypes?: UserTokenType[]): Promise<void> => {
    if (tokenTypes) {
      await this.repository.delete({ userId, tokenType: In(tokenTypes) });
    } else {
      await this.repository.delete({ userId });
    }
  };
  update = async ({
    oldTokenValue,
    newTokenValue,
    expirationDate,
  }: UpdateTokenOptions): Promise<void> => {
    await this.repository.update(
      { value: oldTokenValue },
      { value: newTokenValue, expirationDate },
    );
  };
}
