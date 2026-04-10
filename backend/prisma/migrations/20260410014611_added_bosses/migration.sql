-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "boss_id" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "bosses" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "color" VARCHAR(50) NOT NULL,

    CONSTRAINT "bosses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_boss_id_fkey" FOREIGN KEY ("boss_id") REFERENCES "bosses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
