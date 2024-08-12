CREATE TABLE IF NOT EXISTS "tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"canBeRefreshed" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"expirationDate" timestamp NOT NULL,
	CONSTRAINT "tokens_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "value_idx" ON "tokens" USING btree ("value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");