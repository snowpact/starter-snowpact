import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

import { TYPES } from '@/configuration/di/types';

import { ClientDatabaseInterface } from './clientDatabase.interface';
import { CustomNamingStrategy } from './customNamingStrategy';
import * as migrations from '../migrations';
import * as schemas from '../schema';

@injectable()
export class ClientDatabase implements ClientDatabaseInterface {
  private dataSource: DataSource;

  constructor(@inject(TYPES.EnvConfig) envConfig: EnvConfigInterface) {
    this.dataSource = new DataSource({
      type: 'postgres',
      entities: [...Object.values(schemas)],
      synchronize: false,
      migrationsRun: envConfig.autoMigration,
      migrations: [...Object.values(migrations)],
      namingStrategy: new CustomNamingStrategy(),
      logging: envConfig.logSql,
    });
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async connect(dbUrl: string): Promise<void> {
    this.dataSource.setOptions({ url: dbUrl });
    await this.dataSource.initialize();
  }
  async disconnect(): Promise<void> {
    await this.dataSource.destroy();
  }

  async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations({ transaction: 'all' });
  }
}
