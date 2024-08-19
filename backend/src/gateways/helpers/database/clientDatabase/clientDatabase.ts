import { injectable } from 'inversify';
import { DataSource } from 'typeorm';

import { ClientDatabaseInterface } from './clientDatabase.interface';
import { CustomNamingStrategy } from './customNamingStrategy';
import * as migrations from '../migrations';
import * as schemas from '../schema';

@injectable()
export class ClientDatabase implements ClientDatabaseInterface {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      entities: [...Object.values(schemas)],
      synchronize: false,
      migrationsRun: true,
      migrations: [...Object.values(migrations)],
      namingStrategy: new CustomNamingStrategy(),
      logging: true,
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
}
