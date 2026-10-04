import { removeItem } from "../../game/inventory.service";

export async function dropItemTool(gameId: string, itemId: string) {
    return removeItem(gameId, itemId)
}