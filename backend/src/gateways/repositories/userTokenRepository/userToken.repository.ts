import { inject, injectable } from 'inversify';
import { In, Repository } from 'typeorm';

import {
  UserTokenInterface,
  UserTokenType,
} from '@/domain/entities/userToken/userToken.entity.interface';
import {
  UserTokenRepositoryInterface,
  DeleteByOptions,
  UpdateTokenOptions,
} from '@/domain/interfaces/repositories/userToken.repository.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { UserTokenSchema } from '@/gateways/helpers/database/schema/token.schema';

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
  deleteByUser = async (userId: string, options?: DeleteByOptions): Promise<void> => {
    const query = this.repository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId });

    if (options?.exceptTokenValue) {
      query.andWhere('value != :exceptTokenValue', { exceptTokenValue: options.exceptTokenValue });
    }

    if (options?.tokenType) {
      query.andWhere('tokenType = :type', { type: options.tokenType });
    }

    await query.execute();
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
