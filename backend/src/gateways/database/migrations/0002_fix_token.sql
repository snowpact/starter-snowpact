DO $$ BEGIN
 CREATE TYPE "public"."token_type" AS ENUM('accountValidation', 'resetPassword', 'refreshToken');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "tokenType" "token_type" NOT NULL;