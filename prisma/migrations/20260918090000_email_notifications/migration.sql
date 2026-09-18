CREATE TYPE "EmailNotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELED');
ALTER TABLE "organization_settings" ADD COLUMN "notificationLocale" TEXT NOT NULL DEFAULT 'ru';
UPDATE "organization_settings" SET "notificationLocale" = CASE WHEN "defaultLocale" = 'en' THEN 'en' ELSE 'ru' END;

CREATE TABLE "email_notifications" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "recipientUserId" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "status" "EmailNotificationStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "firstAttemptAt" TIMESTAMP(3),
  "lockedUntil" TIMESTAMP(3),
  "lockToken" TEXT,
  "uncertain" BOOLEAN NOT NULL DEFAULT false,
  "lastErrorCode" TEXT,
  "providerEmailId" TEXT,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "email_notifications_messageId_recipientUserId_key" ON "email_notifications"("messageId", "recipientUserId");
CREATE INDEX "email_notifications_origin_status_nextAttemptAt_idx" ON "email_notifications"("origin", "status", "nextAttemptAt");
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "email_notifications" ADD CONSTRAINT "email_notifications_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
