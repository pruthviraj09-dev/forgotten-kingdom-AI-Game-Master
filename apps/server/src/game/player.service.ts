import { db } from "@repo/db"

export async function getPlayer(gameId: string) {

    const player = await db.orm.public.Player.where({ gameId }).include("location").first()

    if (!player) {
        throw new Error("player not found")
    }

    return {
        id: player.id,
        name: player.name,
        hp: player.hp,
        maxHp: player.maxHp,
        gold: player.gold,
        level: player.level,
        location: {
            id: player.location.id,
            name: player.location.name,
        },
    }

}

