ALTER TABLE "users" ADD COLUMN "preferredLocale" TEXT NOT NULL DEFAULT 'ru';
ALTER TABLE "organization_settings" DROP COLUMN "notificationLocale";
