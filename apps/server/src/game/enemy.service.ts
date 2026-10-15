import { db } from "@repo/db";


export async function getNearbyEnemies(gameId: string) {
    const player = await db.orm.public.Player.where({ id: gameId }).first()

    if (!player) {
        throw new Error("player not found")
    }

    const enemies = await db.orm.public.Enemy.where({ locationId: player.locationId }).all()

    return enemies.map((enemy) => ({
        id: enemy.id,
        name: enemy.name,
        description: enemy.description,
        hp: enemy.hp,
        maxHp: enemy.maxHp,
    }))
}