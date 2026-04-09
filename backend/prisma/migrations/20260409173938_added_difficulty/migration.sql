-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "modifiers" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "sprite" VARCHAR(255) NOT NULL,

    CONSTRAINT "modifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_modifiers" (
    "battle_id" INTEGER NOT NULL,
    "modifier_id" INTEGER NOT NULL,

    CONSTRAINT "battle_modifiers_pkey" PRIMARY KEY ("battle_id","modifier_id")
);

-- AddForeignKey
ALTER TABLE "battle_modifiers" ADD CONSTRAINT "battle_modifiers_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_modifiers" ADD CONSTRAINT "battle_modifiers_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
