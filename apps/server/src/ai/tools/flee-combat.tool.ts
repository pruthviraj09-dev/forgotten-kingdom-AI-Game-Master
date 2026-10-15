import { fleeCombat } from "../../game/combat.service";


export async function fleeCombatTool(gameId: string, enemyId: string) {
    return fleeCombat(gameId, enemyId)
}