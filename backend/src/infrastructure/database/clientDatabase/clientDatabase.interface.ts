import { Client } from 'pg';

export interface ClientDatabaseInterface {
  getClient(): Client;
  connect(dbUrl: string): Promise<void>;
}
