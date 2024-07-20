import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';

import { UserInterface } from '@/application/entities/user/user.entity.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { users } from '@/infrastructure/database/schema';
import * as schema from '@/infrastructure/database/schema';
import { TYPES } from '@/infrastructure/di/types';

import { UserRepositoryInterface } from './user.repository.interface';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private db: NodePgDatabase<typeof schema>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.db = drizzle(clientDatabase.getClient(), { schema });
  }
  async findById(id: string): Promise<UserInterface | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0];
  }
  async updateOne(id: string, data: Partial<UserInterface>): Promise<void> {
    await this.db.update(users).set(data).where(eq(users.id, id));
  }

  async findByEmail(email: string): Promise<UserInterface | undefined> {
    const results = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return results[0];
  }
}
