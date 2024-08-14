import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import * as schema from '@/gateways/helpers/database/schema';

import { mainContainer } from '../di/mainContainer';
import { TYPES } from '../di/types';

export class TestDbService {
  private clientDatabase: ClientDatabaseInterface;
  private db: NodePgDatabase<typeof schema>;

  private constructor() {
    this.clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    this.db = drizzle(this.clientDatabase.getClient(), { schema });
  }

  public static setup = async (): Promise<TestDbService> => {
    const testDbService = new TestDbService();
    await migrate(testDbService.db, {
      migrationsFolder: './src/gateways/helpers/database/migrations',
    });

    return testDbService;
  };

  public close = async (): Promise<void> => {
    await this.clientDatabase.getClient().end();
  };

  public clear = async (): Promise<void> => {
    const tableSchema = this.db._.schema;
    if (!tableSchema) {
      throw new Error('No table schema found');
    }

    const queries = Object.values(tableSchema).map((table) => {
      return sql.raw(`TRUNCATE TABLE ${table.dbName} CASCADE;`);
    });

    await this.db.transaction(async (tx) => {
      await Promise.all(queries.map((query) => tx.execute(query)));
    });
  };

  public persistUser = async (user: UserInterface): Promise<void> => {
    await this.db.insert(schema.users).values(user);
  };

  public getUser = async (id: string): Promise<UserInterface | undefined> => {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return results[0];
  };

  public persistToken = async (token: UserTokenInterface): Promise<void> => {
    await this.db.insert(schema.tokens).values(token);
  };

  public getToken = async (tokenValue: string): Promise<UserTokenInterface | undefined> => {
    const results = await this.db
      .select()
      .from(schema.tokens)
      .where(eq(schema.tokens.value, tokenValue))
      .limit(1);
    return results[0];
  };
}
