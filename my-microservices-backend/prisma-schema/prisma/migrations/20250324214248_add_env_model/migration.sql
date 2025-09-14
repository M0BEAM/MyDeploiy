-- CreateTable
CREATE TABLE "EnvironmentVariable" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "deployId" TEXT,

    CONSTRAINT "EnvironmentVariable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnvironmentVariable" ADD CONSTRAINT "EnvironmentVariable_deployId_fkey" FOREIGN KEY ("deployId") REFERENCES "Deploy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
