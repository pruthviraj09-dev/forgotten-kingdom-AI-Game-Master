import { startCombat } from "../../game/combat.service";

export async function startCombatTool(gameId: string, enemyId: string) {
    return startCombat(gameId, enemyId)
}