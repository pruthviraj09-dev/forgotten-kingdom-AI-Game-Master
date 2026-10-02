import { getInventoryTool } from "./tools/get-inventory.tool"
import { getLocationTool } from "./tools/get-location.tool"
import { getNearbyLocationsTool } from "./tools/get-nearby-locations.tool"
import { getPlayerTool } from "./tools/get-player.tool"
import { movePlayerTool } from "./tools/move-player.tool"
import { getLocationInput, getNearbyLocationsInput, movePlayerInput } from "./tools/types"


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
            const input = movePlayerInput.parse(args)
            return movePlayerTool(context.gameId, input.destinationId)

        default:
            throw new Error(`Unknown tool: ${toolName}`)
    }



}