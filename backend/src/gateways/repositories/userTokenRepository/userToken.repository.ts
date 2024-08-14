import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';

import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import * as schema from '@/gateways/helpers/database/schema';

import {
  UserTokenRepositoryInterface,
  UpdateOptions,
} from '../../../domain/interfaces/repositories/userToken.repository.interface';

@injectable()
export class UserTokenRepository implements UserTokenRepositoryInterface {
  private db: NodePgDatabase<typeof schema>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.db = drizzle(clientDatabase.getClient(), { schema });
  }
  create = async (token: UserTokenInterface): Promise<void> => {
    await this.db.insert(schema.tokens).values(token);
  };
  findByTokenValue = async (tokenValue: string): Promise<UserTokenInterface | undefined> => {
    const result = await this.db
      .select()
      .from(schema.tokens)
      .where(eq(schema.tokens.value, tokenValue));
    return result[0];
  };
  delete = async (tokenValue: string): Promise<void> => {
    await this.db.delete(schema.tokens).where(eq(schema.tokens.value, tokenValue));
  };
  update = async ({
    oldTokenValue,
    newTokenValue,
    expirationDate,
  }: UpdateOptions): Promise<void> => {
    await this.db
      .update(schema.tokens)
      .set({ value: newTokenValue, expirationDate })
      .where(eq(schema.tokens.value, oldTokenValue));
  };
}
