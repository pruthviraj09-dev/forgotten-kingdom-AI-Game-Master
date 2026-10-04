import { addItem } from "../../game/inventory.service";


export async function pickupItemTool(gameId: string, itemId: string) {
    return addItem(gameId, itemId)
}