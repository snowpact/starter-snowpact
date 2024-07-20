import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export default class TestContainers {
  postgresContainer: StartedPostgreSqlContainer;

  postgresUri: string;
  // Generate unique names for containers
  private getUniqueName(baseName: string): string {
    return `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  start = async (): Promise<void> => {
    this.postgresContainer = await new PostgreSqlContainer()
      .withName(this.getUniqueName('postgres'))
      .start();

    this.postgresUri = this.postgresContainer.getConnectionUri();
  };

  stop = async (): Promise<void> => {
    await this.postgresContainer.stop();
  };

  getUris = (): { postgresUri: string } => {
    return { postgresUri: this.postgresUri };
  };
}
