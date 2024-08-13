import { injectable } from 'inversify';
import { Client } from 'pg';

import { ClientDatabaseInterface } from './clientDatabase.interface';

@injectable()
export class ClientDatabase implements ClientDatabaseInterface {
  private client: Client;
  public connected: boolean = false;

  getClient(): Client {
    return this.client;
  }
  async connect(dbUrl: string): Promise<void> {
    this.client = new Client({
      connectionString: dbUrl,
    });
    await this.client.connect();
    this.connected = true;
  }
}
