import { MigrationInterface } from 'typeorm';

export class Setup0000000000001 implements MigrationInterface {
  name = 'Setup0000000000001';

  public async up(): Promise<void> {}

  public async down(): Promise<void> {}
}
