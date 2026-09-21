CREATE TABLE "telegram_connections" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "chatId" TEXT,
  "telegramUserId" TEXT,
  "username" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "connectedAt" TIMESTAMP(3),
  "pendingTokenHash" TEXT,
  "pendingExpiresAt" TIMESTAMP(3),
  "pendingChatId" TEXT,
  "pendingTelegramUserId" TEXT,
  "pendingUsername" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "telegram_connections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "telegram_connections_chatId_key" ON "telegram_connections"("chatId");
CREATE UNIQUE INDEX "telegram_connections_pendingTokenHash_key" ON "telegram_connections"("pendingTokenHash");
CREATE UNIQUE INDEX "telegram_connections_userId_origin_key" ON "telegram_connections"("userId", "origin");
ALTER TABLE "telegram_connections" ADD CONSTRAINT "telegram_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TYPE "TelegramNotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELED');
CREATE TABLE "telegram_notifications" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "recipientUserId" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "chatId" TEXT NOT NULL,
  "status" "TelegramNotificationStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedUntil" TIMESTAMP(3),
  "lockToken" TEXT,
  "lastErrorCode" TEXT,
  "providerMessageId" TEXT,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "telegram_notifications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "telegram_notifications_messageId_recipientUserId_key" ON "telegram_notifications"("messageId", "recipientUserId");
CREATE INDEX "telegram_notifications_origin_status_nextAttemptAt_idx" ON "telegram_notifications"("origin", "status", "nextAttemptAt");
ALTER TABLE "telegram_notifications" ADD CONSTRAINT "telegram_notifications_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "telegram_notifications" ADD CONSTRAINT "telegram_notifications_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
