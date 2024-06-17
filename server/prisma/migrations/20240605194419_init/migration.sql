-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "dob" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BoomIntegration" (
    "userId" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    CONSTRAINT "BoomIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BoomIntegration_authToken_key" ON "BoomIntegration"("authToken");
