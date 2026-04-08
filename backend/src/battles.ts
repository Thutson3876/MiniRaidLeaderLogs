import { Router, Request, Response } from "express";
import { prisma } from "./prisma";
import { MeterPayload } from "./types";

export const battlesRouter = Router();

battlesRouter.post("/", async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as MeterPayload;

    if (
        typeof payload.battleWon !== "boolean" ||
        typeof payload.battleDuration !== "number" ||
        typeof payload.damage !== "object" ||
        typeof payload.stagger !== "object" ||
        typeof payload.healing !== "object"
    ) {
        res.status(400).json({ error: "Invalid payload" });
        return;
    }

    try {
        const newBattle = await prisma.$transaction(async (tx) => {
        return await tx.battle.create({
            data: {
            battleWon: payload.battleWon,
            battleDuration: payload.battleDuration,
            damageEntries: {
                create: Object.entries(payload.damage).map(([cls, amount]) => ({
                playerClass: cls,
                amount,
                })),
            },
            staggerEntries: {
                create: Object.entries(payload.stagger).map(([cls, amount]) => ({
                playerClass: cls,
                amount,
                })),
            },
            healingEntries: {
                create: Object.entries(payload.healing).map(([cls, amount]) => ({
                playerClass: cls,
                amount,
                })),
            },
            },
        });
        });

        res.status(201).json({ id: newBattle.id });
    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
    });

    battlesRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const rawBattles = await prisma.battle.findMany({
        take: 100,
        orderBy: { recordedAt: "desc" },
        include: {
            damageEntries: true,
            staggerEntries: true,
            healingEntries: true,
        },
        });

        const formattedBattles = rawBattles.map((b) => ({
        id: b.id,
        battle_won: b.battleWon,
        battle_duration: b.battleDuration.toNumber(),
        recorded_at: b.recordedAt,
        damage: Object.fromEntries(b.damageEntries.map((e) => [e.playerClass, e.amount.toNumber()])),
        stagger: Object.fromEntries(b.staggerEntries.map((e) => [e.playerClass, e.amount.toNumber()])),
        healing: Object.fromEntries(b.healingEntries.map((e) => [e.playerClass, e.amount.toNumber()])),
        }));

        res.json(formattedBattles);
    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});