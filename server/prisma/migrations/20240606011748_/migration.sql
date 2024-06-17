/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BoomIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BoomIntegration_userId_key" ON "BoomIntegration"("userId");
