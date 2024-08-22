import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAndToken1724317932906 implements MigrationInterface {
  name = 'UserAndToken1724317932906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL,
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "admin" boolean NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "uq__user-email__fd4cd3ef" UNIQUE ("email"),
                CONSTRAINT "pk__user-id__da1c887e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_token" (
                "id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "value" character varying(255) NOT NULL,
                "can_be_refreshed" boolean NOT NULL,
                "token_type" character varying(255) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "uq__user_token-value__5137afa4" UNIQUE ("value"),
                CONSTRAINT "pk__user_token-id__d0f00bd7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_token"
            ADD CONSTRAINT "fk__user_token-user_id__user-id__a6427bb5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_token" DROP CONSTRAINT "fk__user_token-user_id__user-id__a6427bb5"
        `);
    await queryRunner.query(`
            DROP TABLE "user_token"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
