import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailValidated1725119704127 implements MigrationInterface {
  name = 'EmailValidated1725119704127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email_verified" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email_verified"
        `);
  }
}
