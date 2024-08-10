import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';

import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { TokenInterface } from '@/infrastructure/services/stateFullToken/token/token.interface';

import * as schema from '@/infrastructure/database/schema';
import { TYPES } from '@/infrastructure/di/types';

import { TokenRepositoryInterface, UpdateOptions } from './token.repository.interface';

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
