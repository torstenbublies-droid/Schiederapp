-- Migration: Change userId to oneSignalPlayerId in userNotifications table
-- This allows notifications to work without user login, based on OneSignal Player ID

-- Step 1: Add new column
ALTER TABLE "userNotifications" 
ADD COLUMN IF NOT EXISTS "oneSignalPlayerId" VARCHAR(64);

-- Step 2: Drop the old userId column and foreign key constraint
ALTER TABLE "userNotifications" 
DROP CONSTRAINT IF EXISTS "fk_user";

ALTER TABLE "userNotifications" 
DROP COLUMN IF EXISTS "userId";

-- Step 3: Make oneSignalPlayerId NOT NULL (after data migration if needed)
ALTER TABLE "userNotifications" 
ALTER COLUMN "oneSignalPlayerId" SET NOT NULL;

-- Step 4: Create index for faster queries
CREATE INDEX IF NOT EXISTS "idx_userNotifications_oneSignalPlayerId" ON "userNotifications"("oneSignalPlayerId");

