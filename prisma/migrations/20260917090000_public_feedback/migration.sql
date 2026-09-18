CREATE TYPE "MessageMood" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');
ALTER TABLE "messages" ADD COLUMN "mood" "MessageMood" NOT NULL DEFAULT 'NEUTRAL',
ADD COLUMN "submissionId" TEXT;
CREATE UNIQUE INDEX "messages_channelId_submissionId_key" ON "messages"("channelId", "submissionId");
CREATE TABLE "public_rate_limits" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "public_rate_limits_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "public_rate_limits_expiresAt_idx" ON "public_rate_limits"("expiresAt");
