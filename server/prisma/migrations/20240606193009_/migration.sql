-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoomIntegration" (
    "userId" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "boomId" TEXT NOT NULL,
    "deleted_at" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BoomIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BoomIntegration" ("authToken", "boomId", "userId") SELECT "authToken", "boomId", "userId" FROM "BoomIntegration";
DROP TABLE "BoomIntegration";
ALTER TABLE "new_BoomIntegration" RENAME TO "BoomIntegration";
CREATE UNIQUE INDEX "BoomIntegration_userId_key" ON "BoomIntegration"("userId");
CREATE UNIQUE INDEX "BoomIntegration_authToken_key" ON "BoomIntegration"("authToken");
CREATE UNIQUE INDEX "BoomIntegration_boomId_key" ON "BoomIntegration"("boomId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
