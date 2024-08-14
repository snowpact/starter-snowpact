import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'inversify';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import * as schema from '@/gateways/helpers/database/schema';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private db: NodePgDatabase<typeof schema>;
  constructor(@inject(TYPES.ClientDatabase) clientDatabase: ClientDatabaseInterface) {
    this.db = drizzle(clientDatabase.getClient(), { schema });
  }
  async findById(id: string): Promise<UserInterface | undefined> {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return results[0];
  }
  async updateOne(id: string, data: Partial<UserInterface>): Promise<void> {
    await this.db.update(schema.users).set(data).where(eq(schema.users.id, id));
  }

  async findByEmail(email: string): Promise<UserInterface | undefined> {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return results[0];
  }
}
