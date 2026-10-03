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

export async function addItem(gameId: string, itemId: string, quantity: number = 1) {
    const player = await db.orm.public.Player.where({ gameId }).first()

    if (!player) {
        throw new Error("player not found")
    }
    const item = await db.orm.public.Item.where({ id: itemId, locationId: player.locationId }).first()

    if (!item) {
        throw new Error("item not found")
    }

    const inventoryItem = await db.orm.public.InventoryItem.where({ playerId: player.id, itemId: item.id }).first()

    if (inventoryItem) {
        await db.orm.public.InventoryItem.where({ id: inventoryItem.id }).update({ quantity: inventoryItem.quantity + quantity })
    } else {
        await db.orm.public.InventoryItem.create({
            itemId: item.id,
            playerId: player.id,
            quantity: quantity
        })
    }

    await db.orm.public.Item.where({ id: item.id }).update({ locationId: null })

    return { success: true, item: inventoryItem }
}

export async function removeItem(gameId: string, itemId: string, quantity: number = 1) {
    const player = await db.orm.public.Player.where({ gameId }).include("inventory", (inventory) => inventory.include("item")).first()

    if (!player) {
        throw new Error("player not found")
    }

    const inventoryItem = await db.orm.public.InventoryItem.where({ itemId, playerId: player.id }).first()

    if (!inventoryItem) {
        throw new Error("item not found")
    }

    if (quantity >= inventoryItem.quantity) {
        await db.orm.public.InventoryItem.where({ id: inventoryItem.id }).delete()
        await db.orm.public.Item.where({ id: inventoryItem.itemId }).update({ locationId: player.locationId })
    } else {
        await db.orm.public.InventoryItem.where({ id: inventoryItem.id }).update({ quantity: inventoryItem.quantity - quantity })
    }

    return { success: true, removedItem: { itemId, quantity } }
}