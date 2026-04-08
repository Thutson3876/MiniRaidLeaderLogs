-- CreateTable
CREATE TABLE "battles" (
    "id" SERIAL NOT NULL,
    "battle_won" BOOLEAN NOT NULL,
    "battle_duration" DECIMAL(10,2) NOT NULL,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damage_entries" (
    "id" SERIAL NOT NULL,
    "battle_id" INTEGER NOT NULL,
    "player_class" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "damage_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stagger_entries" (
    "id" SERIAL NOT NULL,
    "battle_id" INTEGER NOT NULL,
    "player_class" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "stagger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healing_entries" (
    "id" SERIAL NOT NULL,
    "battle_id" INTEGER NOT NULL,
    "player_class" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "healing_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "damage_entries" ADD CONSTRAINT "damage_entries_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stagger_entries" ADD CONSTRAINT "stagger_entries_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healing_entries" ADD CONSTRAINT "healing_entries_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
