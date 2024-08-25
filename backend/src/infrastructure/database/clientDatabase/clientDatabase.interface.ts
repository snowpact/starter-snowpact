import { DataSource } from 'typeorm';

export interface ClientDatabaseInterface {
  getDataSource(): DataSource;
  connect(dbUrl: string): Promise<void>;
  disconnect(): Promise<void>;
  runMigrations(): Promise<void>;
}
