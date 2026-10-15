import { db } from "@repo/db";


export async function startCombat(gameId: string, enemyId: string) {

    const player = await db.orm.public.Player.where({ gameId }).first()

    if (!player) {
        throw new Error("player not found")
    }

    const enemy = await db.orm.public.Enemy.where({
        id: enemyId,
        locationId: player.locationId
    }).first()

    if (!enemy) {
        throw new Error("Enemy not found at the player's current location")
    }

    if (enemy.hp <= 0) {
        throw new Error("This enemy has already been defeated")
    }

    const existingCombat = await db.orm.public.Combat.where({
        gameId,
        status: "active"
    }).first()

    if (existingCombat) {
        if (existingCombat.enemyId === enemyId) {
            return {
                success: true,
                message: "Combat is already active against this enemy",
                combatId: existingCombat.id,
                enemy: {
                    id: enemy.id,
                    name: enemy.name,
                    hp: enemy.hp,
                    maxHp: enemy.maxHp,
                },
            };
        }

        throw new Error("Another combat encounter is already active");
    }

    const combat = await db.orm.public.Combat.create({
        enemyId,
        gameId,
    })

    return {
        success: true,
        message: "Combat started",
        combatId: combat.id,
        enemy: {
            id: enemy.id,
            name: enemy.name,
            hp: enemy.hp,
            maxHp: enemy.maxHp,
        },
    };
}

export async function attackEnemy(gameId: string, enemyId: string) {

    const player = await db.orm.public.Player.where({ gameId }).first()

    if (!player) {
        throw new Error("player not found")
    }

    const combat = await db.orm.public.Combat.where({
        gameId,
        enemyId,
        status: "active"
    }).first()

    if (!combat) {
        throw new Error("No Active combat with this enemy")
    }

    const enemy = await db.orm.public.Enemy
        .where({
            id: enemyId,
            locationId: player.locationId,
        })
        .first();

    if (!enemy) {
        throw new Error(
            "Enemy is not at the player's current location"
        );
    }

    if (enemy.hp <= 0) {
        throw new Error("This enemy has already been defeated")
    }

    const damage = 10;
    const newEnemyHp = Math.max(0, enemy.hp - damage)

    const defeated = newEnemyHp === 0

    if (defeated) {
        await db.orm.public.Combat.where({ id: combat.id }).update({ status: "playerWon" })
    }

    return {
        success: true,
        damage,
        defeated,
        enemy: {
            id: enemy.id,
            name: enemy.name,
            previousHp: enemy.hp,
            hp: newEnemyHp,
            maxHp: enemy.maxHp,
        },
        combatStatus: defeated ? "playerwon" : "active",
    }


}

export async function fleeCombat(gameId: string, enemyId: string) {

    const player = await db.orm.public.Player
        .where({ gameId })
        .first();

    if (!player) {
        throw new Error("Player not found");
    }

    const combat = await db.orm.public.Combat
        .where({
            gameId,
            enemyId,
            status: "active",
        })
        .first();

    if (!combat) {
        throw new Error("No active combat with this enemy");
    }

    const enemy = await db.orm.public.Enemy
        .where({
            id: enemyId,
            locationId: player.locationId,
        })
        .first();

    if (!enemy || enemy.hp <= 0) {
        throw new Error("Enemy is not available for this encounter");
    }

    await db.orm.public.Combat.where({ id: combat.id }).update({ status: "fled" })

    return {
        success: true,
        escaped: true,
        combatId: combat.id,
        enemy: {
            id: enemy.id,
            name: enemy.name,
            hp: enemy.hp,
        },
        combatStatus: "fled",
        message: "The player escaped combat.",
    }

}