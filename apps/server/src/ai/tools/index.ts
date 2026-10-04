import { dropItemTool } from "./drop-item.tool";
import { getInventoryTool } from "./get-inventory.tool";
import { getLocationTool } from "./get-location.tool";
import { getNearbyLocationsTool } from "./get-nearby-locations.tool";
import { getPlayerTool } from "./get-player.tool";
import { movePlayerTool } from "./move-player.tool";
import { pickupItemTool } from "./pickup-item.tool";



export const gameTools = {
    get_player: getPlayerTool,
    move_player: movePlayerTool,
    get_inventory: getInventoryTool,
    get_location: getLocationTool,
    get_nearby_locations: getNearbyLocationsTool,
    pickup_itme: pickupItemTool,
    drop_item: dropItemTool
}