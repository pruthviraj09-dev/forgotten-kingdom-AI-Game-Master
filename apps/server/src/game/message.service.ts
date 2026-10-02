import { db as prisma } from "@repo/db";

export async function addGameMessage(
    gameId: string,
    role: "player" | "gm",
    content: string
) {
    return prisma.orm.public.GameMessage.create({
        gameId,
        role,
        content,
    });
}

export async function getGameMessages(
    gameId: string,
    limit = 20
) {
    const messages = await prisma.orm.public.GameMessage.where({ gameId }).orderBy((m) => m.createdAt.desc()).limit(limit).all();

    return messages.reverse();
}