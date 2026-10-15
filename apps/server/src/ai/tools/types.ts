import { z } from "zod";

export const getPlayerInput = z.object({});

export const getLocationInput = z.object({
    locationId: z.string(),
});

export const getNearbyLocationsInput = z.object({
    locationId: z.string(),
});

export const movePlayerInput = z.object({
    destinationId: z.string(),
});

export const getInventoryInput = z.object({});

export const pickupItemInput = z.object({
    itemId: z.string(),
});

export const dropItemInput = z.object({
    itemId: z.string(),
});

export const getQuestsInput = z.object({});

export const createQuestInput = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    objectiveDescription: z.string().min(1),
    objectiveType: z.enum(["VISIT_LOCATION"]),
    targetLocationId: z.string().min(1),
})

export const completeQuestInput = z.object({
    questId: z.string(),
})

export const talkToNpcInput = z.object({
    npcId: z.string(),
})

export const startCombatInput = z.object({
    enemyId: z.string()
})

export const attackEnemyInput = z.object({
    enemyId: z.string()
})

export const fleeCombatInput = z.object({
    enemyId: z.string()
})