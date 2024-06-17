/*
  Warnings:

  - Added the required column `boomId` to the `BoomIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoomIntegration" (
    "userId" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "boomId" TEXT NOT NULL,
    CONSTRAINT "BoomIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BoomIntegration" ("authToken", "userId") SELECT "authToken", "userId" FROM "BoomIntegration";
DROP TABLE "BoomIntegration";
ALTER TABLE "new_BoomIntegration" RENAME TO "BoomIntegration";
CREATE UNIQUE INDEX "BoomIntegration_userId_key" ON "BoomIntegration"("userId");
CREATE UNIQUE INDEX "BoomIntegration_authToken_key" ON "BoomIntegration"("authToken");
CREATE UNIQUE INDEX "BoomIntegration_boomId_key" ON "BoomIntegration"("boomId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
