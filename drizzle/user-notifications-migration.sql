-- Migration: Add userNotifications table for storing received notifications per user
-- This table stores notifications that users have received, with read/unread status

CREATE TABLE IF NOT EXISTS "userNotifications" (
  "id" VARCHAR(64) PRIMARY KEY,
  "userId" VARCHAR(64) NOT NULL,
  "title" VARCHAR(500) NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(20) DEFAULT 'info' NOT NULL,
  "isRead" BOOLEAN DEFAULT false NOT NULL,
  "receivedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "readAt" TIMESTAMP,
  "data" JSONB,
  CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "idx_userNotifications_userId" ON "userNotifications"("userId");
CREATE INDEX IF NOT EXISTS "idx_userNotifications_isRead" ON "userNotifications"("isRead");
CREATE INDEX IF NOT EXISTS "idx_userNotifications_receivedAt" ON "userNotifications"("receivedAt" DESC);

-- Add OneSignal subscription ID to users table
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "oneSignalPlayerId" VARCHAR(64),
ADD COLUMN IF NOT EXISTS "pushEnabled" BOOLEAN DEFAULT true NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_users_oneSignalPlayerId" ON "users"("oneSignalPlayerId");

