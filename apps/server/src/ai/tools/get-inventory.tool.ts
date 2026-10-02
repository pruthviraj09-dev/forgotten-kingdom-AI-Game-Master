import { getInventory } from "../../game/inventory.service";


export async function getInventoryTool(gameId: string) {
    return getInventory(gameId)
}