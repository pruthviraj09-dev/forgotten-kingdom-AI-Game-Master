import { db } from "@repo/db";
import { updateLocationObjectives } from "./quest.service";

export async function getLocation(
    gameId: string,
    locationId: string
) {
    const location = await db.orm.public.Location
        .where({ id: locationId, gameId: gameId })
        .include("npcs")
        .include("enemies")
        .include("items")
        .first()

    if (!location) {
        throw new Error("location not found")
    }

    return {
        id: location.id,
        name: location.name,
        description: location.description,

        npcs: location.npcs.map((npc) => ({
            id: npc.id,
            name: npc.name,
            description: npc.description,
        })),

        enemies: location.enemies.map((enemy) => ({
            id: enemy.id,
            name: enemy.name,
            hp: enemy.hp,
            maxHp: enemy.maxHp,
        })),

        items: location.items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
        })),
    }

}

export async function getNearbyLocations(gameId: string, locationId: string) {

    const location = await db.orm.public.Location
        .where({ gameId, id: locationId })
        .include("connections", (connection) => connection.include("toLocation"))
        .first()

    if (!location) {
        throw new Error("location not found")
    }

    return location.connections.map((connection) => {
        return {
            id: connection.toLocation.id,
            name: connection.toLocation.name,
            description: connection.toLocation.description,
        }
    })


}

export async function movePlayer(gameId: string, destinationId: string) {

    const player = await db.orm.public.Player.where({ gameId }).include("location").first()

    if (!player) {
        throw new Error("player not found")
    }

    const connection = await db.orm.public.LocationConnection.where({
        fromLocationId: player.locationId,
        toLocationId: destinationId
    }).first()

    if (!connection) {
        throw new Error("destination not reachable")
    }

    const updatedPlayer = await db.orm.public.Player.where({ id: player.id }).include("location").update({
        locationId: destinationId,
    })

    if (!updatedPlayer) {
        throw new Error("failed to update player location")
    }

    const updatedObjectives = await updateLocationObjectives(gameId, destinationId)

    return {
        success: true,
        previousLocation: {
            id: player.location.id,
            name: player.location.name,
            description: player.location.description
        },
        location: {
            id: updatedPlayer.location.id,
            name: updatedPlayer.location.name,
            description: updatedPlayer.location.description,
        },
        questUpdates: updatedObjectives,
    }

}