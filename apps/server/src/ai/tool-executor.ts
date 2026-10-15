import { attackEnemyTool } from "./tools/attack-enemy.tool"
import { completeQuestTool } from "./tools/complete-quest.tool"
import { createQuestTool } from "./tools/create-quest.tool"
import { dropItemTool } from "./tools/drop-item.tool"
import { fleeCombatTool } from "./tools/flee-combat.tool"
import { getInventoryTool } from "./tools/get-inventory.tool"
import { getLocationTool } from "./tools/get-location.tool"
import { getNearbyEnemiesTool } from "./tools/get-nearby-enemies.tool"
import { getNearbyLocationsTool } from "./tools/get-nearby-locations.tool"
import { getPlayerTool } from "./tools/get-player.tool"
import { getQuestsTool } from "./tools/get_quests.tool"
import { movePlayerTool } from "./tools/move-player.tool"
import { pickupItemTool } from "./tools/pickup-item.tool"
import { startCombatTool } from "./tools/start-combat.tool"
import { talkToNpcTool } from "./tools/talk-to-npc.tool"
import { attackEnemyInput, completeQuestInput, createQuestInput, dropItemInput, fleeCombatInput, getLocationInput, getNearbyLocationsInput, movePlayerInput, pickupItemInput, startCombatInput, talkToNpcInput } from "./tools/types"


type ToolContext = {
    gameId: string
}

export async function executeTool(
    toolName: string,
    rawArguments: string,
    context: ToolContext
) {
    const args = JSON.parse(rawArguments)

    switch (toolName) {
        case "get_player":
            return getPlayerTool(context.gameId)

        case "get_location":
            const locationInput = getLocationInput.parse(args);
            return getLocationTool(context.gameId, locationInput.locationId)

        case "get_nearby_locations":
            const nearbyLocationsInput = getNearbyLocationsInput.parse(args);
            return getNearbyLocationsTool(context.gameId, nearbyLocationsInput.locationId)

        case "get_inventory":
            return getInventoryTool(context.gameId)

        case "move_player":
            const mpInput = movePlayerInput.parse(args)
            return movePlayerTool(context.gameId, mpInput.destinationId)

        case "pickup_item":
            const pickupInput = pickupItemInput.parse(args)
            return pickupItemTool(context.gameId, pickupInput.itemId)

        case "drop_item":
            const dropInput = dropItemInput.parse(args)
            return dropItemTool(context.gameId, dropInput.itemId)

        case "get_quests":
            return getQuestsTool(context.gameId)

        case "create_quest": {
            const input = createQuestInput.parse(args);

            return createQuestTool(
                context.gameId,
                input.title,
                input.description,
                input.objectiveDescription,
                input.objectiveType,
                input.targetLocationId
            );
        }
        case "complete_quest":
            const CCInput = completeQuestInput.parse(args)
            return completeQuestTool(context.gameId, CCInput.questId)

        case "talk_to_npc":
            const TTNInput = talkToNpcInput.parse(args)
            return talkToNpcTool(context.gameId, TTNInput.npcId)

        case "get_nearby_enemies":
            return getNearbyEnemiesTool(context.gameId)

        case "start_combat":
            const scInput = startCombatInput.parse(args)
            return startCombatTool(context.gameId, scInput.enemyId)

        case "attack_enemy":
            const aeInput = attackEnemyInput.parse(args)
            return attackEnemyTool(context.gameId, aeInput.enemyId)

        case "flee_combat":
            const fcInput = fleeCombatInput.parse(args)
            return fleeCombatTool(context.gameId, fcInput.enemyId)

        // case "use_item":

        // case "":  

        default:
            throw new Error(`Unknown tool: ${toolName}`)
    }



}