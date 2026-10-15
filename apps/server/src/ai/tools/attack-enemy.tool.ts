import { attackEnemy } from "../../game/combat.service";

export async function attackEnemyTool(gameId: string, enemyId: string) {
    return attackEnemy(gameId, enemyId)
}