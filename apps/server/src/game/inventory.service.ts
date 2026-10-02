import { db } from "@repo/db";

export async function getInventory(gameId: string) {
    const player = await db.orm.public.Player.where({ gameId }).include("inventory", (inventory) => inventory.include("item")).first()

    if (!player) {
        throw new Error("player not found")
    }

    return player.inventory.map((inventoryItem) => {
        return {
            itemId: inventoryItem.item.id,
            name: inventoryItem.item.name,
            description: inventoryItem.item.description,
            quantity: inventoryItem.quantity,
        }
    })
}