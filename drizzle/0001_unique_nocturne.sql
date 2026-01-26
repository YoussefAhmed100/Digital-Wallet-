ALTER TABLE "transactions" ADD COLUMN "wallet_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "transaction_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "raw_payload" jsonb NOT NULL;