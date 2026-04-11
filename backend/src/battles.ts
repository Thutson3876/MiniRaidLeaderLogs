import { Router, Request, Response } from "express";
import { prisma } from "./prisma";
import { MeterPayload } from "./types";
import { Prisma } from "../generated/prisma";

export const battlesRouter = Router();

battlesRouter.post("/", async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as MeterPayload;

    if (
        typeof payload.battleWon !== "boolean" ||
        typeof payload.battleDuration !== "number" ||
        typeof payload.difficulty !== "number" ||
        !Array.isArray(payload.modifierIDs) ||
        typeof payload.bossId !== "number" ||
        typeof payload.damage !== "object" ||
        typeof payload.stagger !== "object" ||
        typeof payload.healing !== "object"
    ) {
        res.status(400).json({ error: "Invalid payload" });
        return;
    }

    try {
        console.log("Received payload: ", req.body);

        const newBattle = await prisma.$transaction(async (tx) => {
            return await tx.battle.create({
                data: {
                    battleWon: payload.battleWon,
                    battleDuration: payload.battleDuration,
                    difficulty: payload.difficulty,

                    modifiers: {
                        create: payload.modifierIDs.map((id) => ({
                            modifier: {
                                connect: { id }
                            }
                        }))
                    },

                    boss: {
                        connect: { id: payload.bossId }
                    },

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


battlesRouter.get("/", async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const perPage = Math.max(1, parseInt(req.query.perPage as string) || 20);
    const skip = (page - 1) * perPage;

    const outcome = req.query.outcome as string | undefined;
    let battleWonFilter: boolean | undefined;
    if (outcome === "won")  battleWonFilter = true;
    if (outcome === "lost") battleWonFilter = false;

    const diffMin = req.query.diffMin !== undefined ? parseFloat(req.query.diffMin as string) : undefined;
    const diffMax = req.query.diffMax !== undefined ? parseFloat(req.query.diffMax as string) : undefined;

    const recordedAfter  = req.query.recordedAfter  ? new Date(req.query.recordedAfter  as string) : undefined;
    const recordedBefore = req.query.recordedBefore ? new Date(req.query.recordedBefore as string) : undefined;

    const characterParam = req.query.characters as string | undefined;
    const characters = characterParam
        ? characterParam.split(",").map((c) => c.trim()).filter(Boolean)
        : undefined;

    const modifierParam = req.query.modifiers as string | undefined;
    const modifierIDs = modifierParam
        ? modifierParam.split(",").map((m) => parseInt(m.trim())).filter((n) => !isNaN(n))
        : undefined;

    const bossIdParam = req.query.bossId as string | undefined;
    const bossId = bossIdParam !== undefined ? parseInt(bossIdParam) : undefined;

    try {
        const andConditions: Prisma.BattleWhereInput[] = [
            ...( characters?.length
                ? characters.map((cls) => ({
                    OR: [
                        { damageEntries:  { some: { playerClass: cls } } },
                        { staggerEntries: { some: { playerClass: cls } } },
                        { healingEntries: { some: { playerClass: cls } } },
                    ],
                }))
                : []),
            ...( modifierIDs?.length
                ? modifierIDs.map((id) => ({
                    modifiers: { some: { modifierId: id } },
                }))
                : []),
        ];

        const where: Prisma.BattleWhereInput = {
            ...(battleWonFilter !== undefined && { battleWon: battleWonFilter }),
            ...(diffMin !== undefined || diffMax !== undefined
                ? { difficulty: { gte: diffMin, lte: diffMax } }
                : {}),
            ...(recordedAfter !== undefined || recordedBefore !== undefined
                ? { recordedAt: { gte: recordedAfter, lte: recordedBefore } }
                : {}),
            ...(bossId !== undefined && !isNaN(bossId) && { bossId }),
            ...(andConditions.length > 0 && { AND: andConditions }),
        };

        const [total, rawBattles] = await prisma.$transaction([
            prisma.battle.count({ where }),
            prisma.battle.findMany({
                where,
                skip,
                take: perPage,
                orderBy: { recordedAt: "desc" },
                include: {
                    modifiers:      { include: { modifier: true } },
                    boss:           true,
                    damageEntries:  true,
                    staggerEntries: true,
                    healingEntries: true,
                },
            }),
        ]);

        const formattedBattles = rawBattles.map((b) => ({
            id:              b.id,
            battle_won:      b.battleWon,
            battle_duration: b.battleDuration.toNumber(),
            difficulty:      b.difficulty,
            boss:            b.boss,
            recorded_at:     b.recordedAt,

            modifiers: b.modifiers.map((m) => ({
                id:          m.modifier.id,
                name:        m.modifier.name,
                description: m.modifier.description,
                color:       m.modifier.color,
                sprite:      m.modifier.sprite,
            })),

            damage: Object.fromEntries(
                b.damageEntries.map((e) => [e.playerClass, e.amount.toNumber()])
            ),
            stagger: Object.fromEntries(
                b.staggerEntries.map((e) => [e.playerClass, e.amount.toNumber()])
            ),
            healing: Object.fromEntries(
                b.healingEntries.map((e) => [e.playerClass, e.amount.toNumber()])
            ),
        }));

        res.json({
            data: formattedBattles,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        });

    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});