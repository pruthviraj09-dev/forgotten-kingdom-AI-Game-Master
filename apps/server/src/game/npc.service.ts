import { db } from "@repo/db";


export async function talkToNpc(
    gameId: string,
    npcId: string
) {
    const player = await db.orm.public.Player.where({ gameId }).first()

    if (!player) {
        throw new Error("player not found")
    }

    const npc = await db.orm.public.NPC.include("location").where({ id: npcId, locationId: player.locationId }).first()

    if (!npc) {
        throw new Error("npc not found")
    }

    if (npc.location.gameId !== gameId) {
        throw new Error("not in the same location")
    }
    let missionOffer = null

    if (npc.questOfferTitle &&
        npc.questOfferDescription &&
        npc.questObjectiveDescription &&
        npc.questObjectiveType) {
        if (!npc.questTargetLocationId) {
            throw new Error("NPC mission has no target location");
        }

        const targetLocation = await db.orm.public.Location.where({ id: npc.questTargetLocationId, gameId }).first()


        if (!targetLocation) {
            throw new Error("NPC mission target location not found");
        }

        missionOffer = {
            title: npc.questOfferTitle,
            description: npc.questOfferDescription,
            objectiveDescription: npc.questObjectiveDescription,
            objectiveType: npc.questObjectiveType,
            targetLocationId: targetLocation.id,
            targetLocationName: targetLocation.name,
        }

        return {
            npc: {
                id: npc.id,
                name: npc.name,
                description: npc.description
            },
            missionOffer
        }

    }


}