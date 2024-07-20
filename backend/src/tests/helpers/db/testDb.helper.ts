import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { UserInterface } from '@/application/entities/user/user.entity.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import * as schema from '@/infrastructure/database/schema';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

import { truncateAllTables } from './truncate.helper';

export class TestDbHelper {
  private clientDatabase: ClientDatabaseInterface;
  private db: NodePgDatabase<typeof schema>;

  private constructor() {
    this.clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    this.db = drizzle(this.clientDatabase.getClient(), { schema });
  }

  public static setup = async (): Promise<TestDbHelper> => {
    const testDbHelper = new TestDbHelper();
    await migrate(testDbHelper.db, {
      migrationsFolder: './src/infrastructure/database/migrations',
    });

    return testDbHelper;
  };

  public close = async (): Promise<void> => {
    await this.clientDatabase.getClient().end();
  };

  public clear = async (): Promise<void> => {
    await truncateAllTables(this.db);
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
}
