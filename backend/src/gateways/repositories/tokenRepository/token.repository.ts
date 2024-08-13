import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';

import { TokenInterface } from '@/domain/entities/token/token.entity.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import * as schema from '@/gateways/helpers/database/schema';

import {
  TokenRepositoryInterface,
  UpdateOptions,
} from '../../../domain/interfaces/repositories/token.repository.interface';

@injectable()
export class TokenRepository implements TokenRepositoryInterface {
  private db: NodePgDatabase<typeof schema>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.db = drizzle(clientDatabase.getClient(), { schema });
  }
  create = async (token: TokenInterface): Promise<void> => {
    await this.db.insert(schema.tokens).values(token);
  };
  findByTokenValue = async (tokenValue: string): Promise<TokenInterface | undefined> => {
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
